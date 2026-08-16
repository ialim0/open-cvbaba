import { useState, useCallback } from 'react';
import axios from 'axios';

interface FeedbackData {
    action: string;
    sentiment: 'positive' | 'negative';
    category?: string;
    comment?: string;
    timestamp: string;
}

export const useFeedback = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitBinaryFeedback = useCallback(async (
        action: string,
        sentiment: 'positive' | 'negative'
    ): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);

        try {
            const data: FeedbackData = {
                action,
                sentiment,
                timestamp: new Date().toISOString(),
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            return response.data.status === 'success';
        } catch (err) {
            console.error('Error submitting binary feedback:', err);
            setError('Failed to submit feedback');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const submitDetailedFeedback = useCallback(async (
        action: string,
        category: string,
        comment?: string
    ): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);

        try {
            const data: FeedbackData = {
                action,
                sentiment: 'negative',
                category,
                comment,
                timestamp: new Date().toISOString(),
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            return response.data.status === 'success';
        } catch (err) {
            console.error('Error submitting detailed feedback:', err);
            setError('Failed to submit feedback');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        submitBinaryFeedback,
        submitDetailedFeedback,
        isSubmitting,
        error,
    };
};
