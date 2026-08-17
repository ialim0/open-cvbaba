// components/VoiceInputSection.tsx
import React from 'react';
import { Mic } from 'lucide-react';
import { AutoResizeTextarea } from '../ui/AutoResizeTextarea';

interface VoiceInputSectionProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  resumeDescription: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const VoiceInputSection: React.FC<VoiceInputSectionProps> = ({
  isRecording,
  startRecording,
  stopRecording,
  resumeDescription,
  handleInputChange,
}) => {

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Voice recording section */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
        {/* Record button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          } text-white shadow-md sm:shadow-lg transition-all hover:shadow-lg active:scale-95`}
          aria-label={isRecording ? "Stoprecording" : "Startrecording"}
        >
          <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Status text */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center">
          {isRecording
            ? "Listening"
            : "Clicktorecord"}
        </p>

        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Transcript textarea */}
      <AutoResizeTextarea
        id="voiceTranscript"
        name="resumeDescription"
        value={resumeDescription}
        onChange={handleInputChange}
        placeholder={"Voicetranscriptplaceholder"}
        className="text-sm"
        readOnly={isRecording}
        minHeight={100}
        maxHeight={300}
        smoothTransition={true}
        variant="default"
      />

      {/* Instructions */}
      <p className="text-xs text-gray-500 px-1">
        {"Voiceinputinstructions"}
      </p>
    </div>
  );
};

export default VoiceInputSection;