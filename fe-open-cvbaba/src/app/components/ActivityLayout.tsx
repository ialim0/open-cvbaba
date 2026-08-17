
"use client"

import type React from "react"
import { Suspense, useState, useCallback, useEffect } from "react"
import axios from "axios"
import { Menu, FileText } from "lucide-react"
import { useRouter, usePathname } from 'next/navigation'

import { SidebarProvider, useSidebar } from "../contexts/SidebarContext"
import Sidebar from "./Sidebar/Sidebar"
import { OpenCvbabaLogo } from "./ui/OpenCvbabaLogo"


// Mini Chat History Items Component for the collapsed sidebar
const MiniChatHistoryItems: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Use the hook from next/navigation
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiBaseUrl) {
          setError("The API URL is not configured.");
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/chats`, {
          withCredentials: true,
          params: {
            skip: 0,
            limit: 10 // Only get a few for the mini sidebar
          }
        });

        if (response.data && Array.isArray(response.data.chats)) {
          setChats(response.data.chats.map((chat: any) => ({
            slug: chat.slug,
            title: chat.title,
            date: chat.date,
            isActive: `/activity/${chat.slug}` === pathname
          })));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Treat 404 as "no chats found" and don't show an error.
          setChats([]);
        } else {
          console.error("Error fetching chats:", error);
          setError("Couldn't load your CV history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [pathname]);

  const handleChatClick = (slug: string) => {
    router.push(`/activity/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <div className="animate-pulse rounded-full h-3 w-3 bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (error || chats.length === 0) {
    return null; // Don't show anything if there's an error or no chats
  }

  return (
    <>
      {chats.map((chat) => (
        <button
          key={chat.slug}
          onClick={() => handleChatClick(chat.slug)}
          className={`w-full p-2 rounded-lg flex justify-center items-center transition-all duration-200 ${chat.isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-100 dark:ring-blue-900'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          title={chat.title}
        >
          <div className={`relative flex items-center justify-center ${chat.isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
            }`}>
            <FileText className="w-5 h-5" />
            {chat.isActive && (
              <span className="absolute -right-1 -top-1 h-2 w-2 bg-blue-600 rounded-full"></span>
            )}
          </div>
        </button>
      ))}
    </>
  );
};

const ActivityLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isLoading] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isSidebarLocked, setIsSidebarLocked] = useState<boolean>(false)


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [setIsSidebarOpen])

  return (
    <div className="flex h-screen relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
      {/* Mobile Navbar - Enhanced with logo and better styling */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 flex justify-between items-center px-4 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <OpenCvbabaLogo className="w-8 h-8 text-black dark:text-white" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">open-cvbaba</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
          aria-label={"Toggle sidebar"}
          suppressHydrationWarning
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Desktop Sidebar Trigger - Minimal and elegant */}
      <div
        className="hidden md:flex fixed top-0 left-0 w-16 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-100 dark:border-gray-800 flex-col items-center z-10 transition-all duration-300"
        onMouseEnter={() => !isMobile && setIsSidebarOpen(true)}
        onMouseLeave={() => !isMobile && setIsSidebarOpen(false)}
      >
        <div className="py-5 flex flex-col items-center gap-4">
          <div className="relative group">
            <OpenCvbabaLogo className={`w-9 h-9 text-black dark:text-white transition-all duration-300 cursor-pointer ${!isSidebarOpen ? 'opacity-100 group-hover:scale-110' : 'opacity-0'}`} />
            <div className="absolute inset-0 bg-gray-900/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 -z-10" />
          </div>
        </div>

        {/* Collapsed sidebar hint */}
        {!isSidebarOpen && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-1.5 text-black dark:text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <Suspense fallback={<div className="w-80">{"Loading sidebar..."}</div>}>
        <div
          className={`fixed md:static z-40 h-full transition-slow ${isSidebarOpen ? "translate-x-0 w-64 md:w-80" : "-translate-x-full w-0"
            } bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-r border-gray-100 dark:border-gray-800`}
          onMouseEnter={() => !isMobile && setIsSidebarOpen(true)}
          onMouseLeave={() => !isMobile && !isSidebarLocked && setIsSidebarOpen(false)}
        >
          {isSidebarOpen && (
            <Sidebar
              isMobile={isMobile}
              onLockedChange={setIsSidebarLocked}
            />
          )}
        </div>
      </Suspense>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-base" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 relative
          ${isSidebarOpen ? "md:ml-0" : "md:pl-16"}
          ${isMobile ? "pt-16" : "pt-0"}
          bg-white dark:bg-gray-900`}
      >
        <Suspense fallback={<div>{"Loading..."}</div>}>{children}</Suspense>
      </main>

      {/* Modals */}
      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="relative">
              <OpenCvbabaLogo className="h-14 w-14 text-black dark:text-white animate-pulse" />
              <div className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 rounded-full animate-ping" />
            </div>
            <div className="text-center">
              <div className="text-gray-900 dark:text-gray-100 font-medium text-lg">Please wait...</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">Processing your request</div>
            </div>
            {/* Progress indicator */}
            <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 dark:bg-gray-100 rounded-full animate-progress" />
            </div>
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0%; }
              50% { width: 70%; }
              100% { width: 100%; }
            }
            .animate-progress {
              animation: progress 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default ActivityLayout