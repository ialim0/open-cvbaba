// hooks/useUserImages.ts
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface UserImage {
    id: number;
    user_id: number;
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
}

interface UseUserImagesReturn {
    images: UserImage[];
    currentAvatar: string | null;
    isLoading: boolean;
    error: string | null;
    refreshImages: () => Promise<void>;
}

export function useUserImages(): UseUserImagesReturn {
    const [images, setImages] = useState<UserImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get<UserImage[]>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/images`,
                { withCredentials: true }
            );

            // Sort by created_at descending to get latest first
            const sortedImages = (response.data || []).sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setImages(sortedImages);
        } catch (err: any) {
            // Silently handle 404 (endpoint not yet implemented)
            // This is expected during the transition period
            if (err?.response?.status === 404) {
                console.debug('User images endpoint not available yet');
                setImages([]);
            } else {
                console.error('Error fetching user images:', err);
                setError('Failed to fetch images');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch images on mount - DISABLED per user request
    useEffect(() => {
        // fetchImages();
    }, [fetchImages]);

    // Get the latest image as the current avatar
    const currentAvatar = images.length > 0 ? images[0].file_url : null;

    return {
        images,
        currentAvatar,
        isLoading,
        error,
        refreshImages: fetchImages,
    };
}
