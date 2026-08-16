import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/i18n';

interface FeedbackFollowUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (category: string, comment?: string) => void;
}

const FeedbackFollowUpModal: React.FC<FeedbackFollowUpModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const { t } = useTranslation('activity');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 'generic', label: t('feedback.follow_up.categories.generic') },
        { id: 'tone', label: t('feedback.follow_up.categories.tone') },
        { id: 'grammar', label: t('feedback.follow_up.categories.grammar') },
        { id: 'slow', label: t('feedback.follow_up.categories.slow') },
        { id: 'other', label: t('feedback.follow_up.categories.other') },
    ];

    const handleSubmit = async () => {
        if (!selectedCategory) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedCategory, comment || undefined);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedCategory('');
        setComment('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in-up">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {t('feedback.follow_up.title')}
                    </h2>
                </div>

                {/* Categories */}
                <div className="space-y-2 mb-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${selectedCategory === category.id
                                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                        >
                            <span className="font-medium">{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Optional comment */}
                {selectedCategory === 'other' && (
                    <div className="mb-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('feedback.follow_up.comment_placeholder')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        {t('feedback.follow_up.skip')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedCategory || isSubmitting}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${selectedCategory && !isSubmitting
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? t('common.loading') : t('feedback.follow_up.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackFollowUpModal;
