import { useState, useEffect } from 'react';

interface UseAnimatedPlaceholderProps {
    placeholders: string[];
    prefix?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export const useAnimatedPlaceholder = ({
    placeholders,
    prefix = '',
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
}: UseAnimatedPlaceholderProps) => {
    const [placeholder, setPlaceholder] = useState(prefix);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(prefix.length);

    useEffect(() => {
        // Safety check for empty placeholders
        if (!placeholders || placeholders.length === 0) {
            setPlaceholder(prefix);
            return;
        }

        const currentPhrase = placeholders[currentPhraseIndex];
        const fullText = prefix + currentPhrase;

        const handleTyping = () => {
            if (isDeleting) {
                // Deleting
                if (charIndex > prefix.length) {
                    setCharIndex((prev) => prev - 1);
                    setPlaceholder(fullText.substring(0, charIndex - 1));
                } else {
                    // Done deleting, switch to next phrase
                    setIsDeleting(false);
                    setCurrentPhraseIndex((prev) => (prev + 1) % placeholders.length);
                }
            } else {
                // Typing
                if (charIndex < fullText.length) {
                    setCharIndex((prev) => prev + 1);
                    setPlaceholder(fullText.substring(0, charIndex + 1));
                } else {
                    // Done typing, pause then delete
                    setIsDeleting(true);
                }
            }
        };

        let timeoutDelay = typingSpeed;
        if (isDeleting) timeoutDelay = deletingSpeed;
        if (!isDeleting && charIndex === fullText.length) timeoutDelay = pauseDuration;

        const timeoutId = setTimeout(handleTyping, timeoutDelay);

        return () => clearTimeout(timeoutId);
    }, [
        charIndex,
        isDeleting,
        currentPhraseIndex,
        placeholders,
        prefix,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
    ]);

    return placeholder;
};
