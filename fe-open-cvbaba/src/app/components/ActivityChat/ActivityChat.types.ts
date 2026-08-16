// src/ui/ActivityChat.types.ts

import { Dispatch, SetStateAction } from 'react';

export interface Chat {
  slug: string;
  title: string;
  pdf_content: string;
  created_at: string;
  access_level?: string;
}

export interface ActivityChatProps {
  onPdfGenerated: (pdfUrl: string) => void;
  includePhoto: boolean;
  setIncludePhoto: Dispatch<SetStateAction<boolean>>;
  chat?: Chat;
}
