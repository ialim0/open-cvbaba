import React from "react"
import type { Metadata } from "next"
import ChatPageClient from "./ChatPageClient"

const DEFAULT_DESCRIPTION = "Chat about your Activity with open-cvbaba"

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      console.warn(`Failed to fetch chat metadata for slug: ${slug}, status: ${response.status}`)
      return {
        title: "Activity Chat | open-cvbaba",
        description: DEFAULT_DESCRIPTION,
      }
    }

    const chat: { title?: string | null } = await response.json()
    const chatTitle = chat.title && chat.title.trim().length > 0
      ? chat.title.trim()
      : "Activity Chat"

    return {
      title: `${chatTitle} | open-cvbaba`,
      description: `Chat about ${chatTitle} with open-cvbaba`,
    }
  } catch (error) {
    console.error(`Error generating metadata for chat ${slug}:`, error)
    return {
      title: "Activity Chat | open-cvbaba",
      description: DEFAULT_DESCRIPTION,
    }
  }
}

export interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ActivityChatPage({ params }: PageProps) {
  const { slug } = await params
  return <ChatPageClient slug={slug} />
}
