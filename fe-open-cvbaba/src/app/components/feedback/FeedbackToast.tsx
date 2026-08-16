import React from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

interface FeedbackToastProps {
    onPositive: () => void;
    onNegative: () => void;
    onDismiss: () => void;
    question: string;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({
    onPositive,
    onNegative,
    onDismiss,
    question,
}) => {
    return (
        <div className="flex items-center justify-between gap-6 pl-6 pr-3 py-3 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-900/20 min-w-[340px] max-w-[420px] animate-in slide-in-from-bottom-8 fade-in duration-300">
            <p className="font-medium text-sm whitespace-nowrap">{question}</p>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPositive}
                    className="p-2 rounded-full hover:bg-white/20 text-white transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Yes"
                >
                    <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                    onClick={onNegative}
                    className="p-2 rounded-full hover:bg-white/20 text-white transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="No"
                >
                    <ThumbsDown className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/20 mx-1"></div>

                <button
                    onClick={onDismiss}
                    className="p-2 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default FeedbackToast;
