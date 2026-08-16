/**
 * Shared form types used across ActivityChat components
 */

export interface ActivityFormData {
    resumeDescription: string;
    selectedTemplateId: string;
    language: string;
    pageCount: number;
    documentSize: string;
    documentOrientation: string;
}

export interface UserProfile {
    full_name: string;
    email?: string;
    // New fields from API update
    custom_instructions: string | null;
    theme_preference: string | null;
    input_language: string;  // Voice input language (default: "en-US")
    output_language: string; // Document output language (default: "en")
}

// Default values for new user profiles
export const DEFAULT_USER_PROFILE: Partial<UserProfile> = {
    input_language: 'en-US',
    output_language: 'en',
    custom_instructions: null,
    theme_preference: null,
};
