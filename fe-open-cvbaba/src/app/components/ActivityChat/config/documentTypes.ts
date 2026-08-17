import { FileText, Mail, LucideIcon } from 'lucide-react';

export interface DocumentType {
    id: 'cv' | 'cover-letter';
    label: string;
    icon: LucideIcon;
}

export const documentTypes: DocumentType[] = [
    { id: 'cv', label: 'CV / Resume', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
];

export const getDocumentTypeById = (id: string): DocumentType | undefined =>
    documentTypes.find((type) => type.id === id);

export const getDocumentTypeLabel = (id: string): string =>
    getDocumentTypeById(id)?.label || id;

export type DocumentTypeId = DocumentType['id'];
