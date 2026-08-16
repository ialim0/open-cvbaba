import { FileText, GraduationCap, FileSignature, Mail, User, Award, LucideIcon } from 'lucide-react';

export interface DocumentType {
    id: string;
    label: string;
    icon: LucideIcon;
}

/**
 * Centralized document types configuration
 * All pages should import from here to ensure consistency
 */
export const documentTypes: DocumentType[] = [
    // Professional Documents
    { id: 'cv', label: 'CV/Resume', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'personal-statement', label: 'Personal Statement', icon: User },
    { id: 'recommendation', label: 'Recommendation Letter', icon: Award },
    { id: 'ghostwritten-recommendation', label: 'Ghostwritten Recommendation Letter', icon: Award },
    { id: 'response-letter', label: 'Response Letter', icon: Mail },

    // Business Documents
    { id: 'business-plan', label: 'Business Plans', icon: FileSignature },
    { id: 'grant-proposal', label: 'Grant Proposals', icon: FileSignature },
    { id: 'rfp-response', label: 'RFP Responses', icon: FileSignature },
    { id: 'legal-contract', label: 'Legal Contracts', icon: FileSignature },

    // Corporate Documents
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'market-report', label: 'Industry / Market Reports', icon: FileText },
    { id: 'compliance-report', label: 'Compliance / ESG Reports', icon: FileSignature },
    { id: 'employee-handbook', label: 'Employee Handbooks', icon: FileText },
    { id: 'operations-manual', label: 'SOPs / Operations Manuals', icon: FileText },

    // Academic & Educational
    { id: 'thesis', label: 'Theses', icon: GraduationCap },
    { id: 'course-textbook', label: 'Course Textbooks', icon: GraduationCap },

    // Creative & Publishing
    { id: 'books', label: 'Books / E-books', icon: FileText },
];

/**
 * Get document type by ID
 */
export const getDocumentTypeById = (id: string): DocumentType | undefined => {
    return documentTypes.find(type => type.id === id);
};

/**
 * Get document type label by ID (useful for translations)
 */
export const getDocumentTypeLabel = (id: string): string => {
    const docType = getDocumentTypeById(id);
    return docType?.label || id;
};

/**
 * Document type IDs for type safety
 */
export type DocumentTypeId = typeof documentTypes[number]['id'];
