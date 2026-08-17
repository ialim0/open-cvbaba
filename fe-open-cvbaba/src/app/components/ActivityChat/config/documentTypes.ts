export const documentType = {
  id: 'cv',
  label: 'CV / Resume',
} as const;

export type DocumentTypeId = typeof documentType.id;
