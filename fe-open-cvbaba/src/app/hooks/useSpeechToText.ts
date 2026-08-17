// hooks/useSpeechToText.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface TranscriptionResult {
    type: 'transcription' | 'partial' | 'error';
    text: string;
    is_final: boolean;
}

interface UseSpeechToTextProps {
    url?: string; // Base WebSocket URL (defaults to current host)
    language?: string; // e.g., "en-US", "fr-FR"
}

export function useSpeechToText({ url, language = "en-US" }: UseSpeechToTextProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const interimTranscriptRef = useRef('');
    const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // VAD Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const lastSpeechTimeRef = useRef<number>(0);
    const isListeningRef = useRef(false);

    // VAD Configuration
    const VAD_THRESHOLD = 0.01; // Amplitude threshold
    const SILENCE_DURATION = 1000; // Keep sending audio for 1s after speech stops

    const startListening = useCallback(async () => {
        try {
            setError(null);
            setTranscript('');
            setInterimTranscript('');
            interimTranscriptRef.current = '';

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });
            streamRef.current = stream;

            // Setup Audio Context for VAD
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            analyserRef.current = analyser;

            // Mint a short-lived Mistral token server-side. Browser clients must
            // never receive or send the long-lived MISTRAL_API_KEY.
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
            const tokenResponse = await fetch(`${apiBaseUrl}/api/realtime/token`, {
                method: 'POST',
                credentials: 'include',
                headers: { Accept: 'application/json' },
            });
            if (!tokenResponse.ok) {
                throw new Error('Unable to start realtime transcription');
            }

            const tokenPayload: { token?: string; model?: string } = await tokenResponse.json();
            if (!tokenPayload.token || !tokenPayload.model) {
                throw new Error('Realtime transcription token was not returned');
            }

            const websocketUrl = `wss://api.mistral.ai/v1/audio/transcriptions/realtime?model=${encodeURIComponent(tokenPayload.model)}`;
            const ws = new WebSocket(websocketUrl, ['realtime', tokenPayload.token]);
            wsRef.current = ws;

            // VAD Processing Loop
            const checkAudioLevel = () => {
                if (!analyserRef.current || !isListeningRef.current) return;

                const dataArray = new Uint8Array(analyserRef.current.fftSize);
                analyserRef.current.getByteTimeDomainData(dataArray);

                // Calculate RMS amplitude
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const x = (dataArray[i] - 128) / 128.0;
                    sum += x * x;
                }
                const rms = Math.sqrt(sum / dataArray.length);

                if (rms > VAD_THRESHOLD) {
                    lastSpeechTimeRef.current = Date.now();
                }

                requestAnimationFrame(checkAudioLevel);
            };

            ws.onopen = () => {
                console.log('STT WebSocket Connected');
                setIsListening(true);
                isListeningRef.current = true;

                // Start VAD loop
                checkAudioLevel();

                // Voxtral realtime expects signed 16-bit mono PCM at 16 kHz.
                const processor = audioContext.createScriptProcessor(4096, 1, 1);
                audioProcessorRef.current = processor;
                const input = audioContext.createMediaStreamSource(stream);
                const targetSampleRate = 16000;
                processor.onaudioprocess = (event) => {
                    if (ws.readyState !== WebSocket.OPEN) return;
                    const elapsed = Date.now() - lastSpeechTimeRef.current;
                    if (elapsed >= SILENCE_DURATION) return;
                    const inputData = event.inputBuffer.getChannelData(0);
                    const ratio = audioContext.sampleRate / targetSampleRate;
                    const outputLength = Math.max(1, Math.floor(inputData.length / ratio));
                    const pcm = new Int16Array(outputLength);
                    for (let i = 0; i < outputLength; i++) {
                        const sample = Math.max(-1, Math.min(1, inputData[Math.floor(i * ratio)]));
                        pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                    }
                    ws.send(pcm.buffer);
                };
                input.connect(processor);
                processor.connect(audioContext.destination);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as {
                        type?: string;
                        text?: string;
                        delta?: string;
                        transcript?: string | { text?: string };
                        error?: string | { message?: string };
                    };
                    const eventType = data.type || '';
                    const text =
                        data.text ||
                        data.delta ||
                        (typeof data.transcript === 'string' ? data.transcript : data.transcript?.text) ||
                        '';
                    const isError = eventType === 'error' || eventType.endsWith('.error');
                    const isDelta = eventType.includes('delta') || eventType === 'partial';
                    const isFinal =
                        eventType === 'transcription' ||
                        eventType.includes('.done') ||
                        eventType.includes('.final');

                    if (isError) {
                        const errorText =
                            typeof data.error === 'string'
                                ? data.error
                                : data.error?.message || text || "Realtime transcription failed";
                        console.error('STT Error:', errorText);
                        setError(errorText);
                    } else if (isDelta && text) {
                        // Mistral sends realtime text in transcription.text.delta events.
                        setInterimTranscript(prev => {
                            const next = prev + text;
                            interimTranscriptRef.current = next;
                            return next;
                        });
                    } else if (isFinal) {
                        const finalText = text || interimTranscriptRef.current;
                        if (finalText) {
                            setTranscript(prev => prev + (prev ? ' ' : '') + finalText.trim());
                        }
                        setInterimTranscript('');
                        interimTranscriptRef.current = '';
                    }
                } catch (e) {
                    console.error('Failed to parse STT message', e);
                }
            };

            ws.onerror = (e) => {
                console.error('WebSocket error', e);
                setError("WebSocket connection failed");
                setIsListening(false);
                isListeningRef.current = false;
            };

            ws.onclose = () => {
                console.log('STT WebSocket Closed');
                setIsListening(false);
                isListeningRef.current = false;

                if (audioProcessorRef.current) {
                    audioProcessorRef.current.disconnect();
                    audioProcessorRef.current = null;
                }

                // Stop AudioContext
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
                audioContextRef.current = null;
                analyserRef.current = null;

                // Stop all audio tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                streamRef.current = null;
            };

        } catch (err) {
            console.error('Realtime transcription startup failed:', err);
            const message = err instanceof Error ? err.message : "Unable to start realtime transcription";
            setError(message);
            setIsListening(false);
            isListeningRef.current = false;
        }
    }, [url, language]);

    const stopListening = useCallback(() => {
        if (audioProcessorRef.current) {
            audioProcessorRef.current.disconnect();
            audioProcessorRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
        }
        setIsListening(false);
        isListeningRef.current = false;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    const clearTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        interimTranscriptRef.current = '';
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        startListening,
        stopListening,
        clearTranscript,
    };
}
