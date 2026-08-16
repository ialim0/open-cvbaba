import type React from "react"
import ActivityLayout from "../components/ActivityLayout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ActivityLayout>{children}</ActivityLayout>
}
