"use client"

import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import ActivityChat from "@/app/components/ActivityChat/ActivityChat"

interface Chat {
  slug: string
  title: string
  pdf_content: string
  created_at: string
}

interface ChatPageClientProps {
  slug: string
}

export default function ChatPageClient({ slug }: ChatPageClientProps) {
  const router = useRouter()
  const [chat, setChat] = useState<Chat | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [includePhoto, setIncludePhoto] = useState<boolean>(false)

  const handlePdfGenerated = useCallback((pdfUrl: string) => {
    console.log("PDF Generated:", pdfUrl)
  }, [])

  const fetchChat = useCallback(async () => {
    if (!slug) return
    try {
      setLoading(true)
      const response = await axios.get<Chat>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      })
      setChat(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching chat:", err)
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
      } else {
        setError("Chat not found")
      }
      setChat(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchChat()
  }, [fetchChat])

  // Update document title when chat data loads
  useEffect(() => {
    if (chat?.title) {
      const chatTitle = chat.title.trim() || "Activity Chat"
      document.title = `${chatTitle} | open-cvbaba`
    }
  }, [chat?.title])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-gray-700">{error}</p>
        <button
          onClick={() => router.push("/activity")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back to CV dashboard"
        >
          {error === 'Your session has expired. Please log in again.' ? 'Login' : 'Go Back Home'}
        </button>
      </div>
    )
  }

  if (!chat) {
    return null
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex-grow overflow-y-auto">
        <ActivityChat
          includePhoto={includePhoto}
          setIncludePhoto={setIncludePhoto}
          onPdfGenerated={handlePdfGenerated}
          chat={chat}
        />
      </div>
    </div>
  )
}
