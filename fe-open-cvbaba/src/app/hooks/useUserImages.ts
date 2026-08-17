// hooks/useUserImages.ts
import { useState, useCallback } from 'react';

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

    const fetchImages = useCallback(async () => undefined, []);

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
