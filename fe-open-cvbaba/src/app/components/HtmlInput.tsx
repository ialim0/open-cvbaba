// HtmlInput.tsx
'use client'

import React from 'react'
import Textarea from '../components/ui/Textarea'

interface HtmlInputProps {
  html: string
  onHtmlChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const HtmlInput: React.FC<HtmlInputProps> = ({ html, onHtmlChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Input</h2>
      <Textarea
        className="w-full h-[calc(100vh-250px)] min-h-[400px]"
        value={html}
        onChange={onHtmlChange}
        placeholder="Enter your HTML here"
      />
    </div>
  )
}
