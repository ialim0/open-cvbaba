"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/ScrollArea";
import { Input } from "../ui/Input";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import ChatHistoryItem from "./components/ChatHistoryItem";
import { useTranslation } from "@/app/i18n/i18n";
import { useSidebar } from "@/app/contexts/SidebarContext";

interface Chat {
  slug: string;
  title: string;
  user_input: string;
  pdf_content: string;
  updated_at: string;
  unread_count?: number;
}

interface ChatHistoryMeta {
  skip: number;
  limit: number;
  total: number;
  has_more: boolean;
  next_skip: number | null;
}

interface ChatHistoryResponse {
  items: Chat[];
  meta: ChatHistoryMeta;
}


interface SidebarProps {
  isMobile: boolean;
  onLockedChange?: (locked: boolean) => void;
}


const Sidebar: React.FC<SidebarProps> = React.memo(
  ({
    isMobile,
    onLockedChange,
  }) => {
    const { t } = useTranslation("settings");
    const router = useRouter();
    const { setIsSidebarOpen } = useSidebar();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());
    const [nextSkip, setNextSkip] = useState<number | null>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);



    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver>();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const activeRequestKeyRef = useRef<string | null>(null);
    const pendingInitialRequestsRef = useRef(0);
    const pendingLoadMoreRequestsRef = useRef(0);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const limit = 10;

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 500);

      return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchChats = useCallback(
      async (skip: number, search: string, replace: boolean = false) => {
        if (!apiBaseUrl) {
          setError(t("sidebar.errors.apiBaseUrlNotDefined"));
          return;
        }

        const sanitizedSkip = Number.isFinite(skip) ? skip : 0;
        const normalizedQuery = search.trim();

        const requestKey = `${sanitizedSkip}:${normalizedQuery}`;
        activeRequestKeyRef.current = requestKey;

        if (sanitizedSkip === 0) {
          pendingInitialRequestsRef.current += 1;
          setLoading(true);
        } else {
          pendingLoadMoreRequestsRef.current += 1;
          setIsLoadingMore(true);
        }

        try {
          const response = await axios.get<ChatHistoryResponse>(`${apiBaseUrl}/api/chat/`, {
            params: {
              skip: sanitizedSkip,
              limit,
              ...(normalizedQuery ? { q: normalizedQuery } : {}),
            },
            headers: { Accept: "application/json" },
            withCredentials: true,
          });

          const { items, meta } = response.data;

          if (activeRequestKeyRef.current !== requestKey) {
            return;
          }

          setChats((prev) => {
            if (replace || sanitizedSkip === 0) {
              return items;
            }

            const existingSlugs = new Set(prev.map((chat) => chat.slug));
            const uniqueNewChats = items.filter((chat) => !existingSlugs.has(chat.slug));
            return [...prev, ...uniqueNewChats];
          });

          setHasMore(meta.has_more);
          setNextSkip(meta.has_more ? meta.next_skip : null);
          setError(null);
        } catch (error) {
          console.error("Error fetching chats:", error);
          setError(t("sidebar.errors.failedToLoadChats"));
        } finally {
          if (sanitizedSkip === 0) {
            pendingInitialRequestsRef.current = Math.max(0, pendingInitialRequestsRef.current - 1);
            if (pendingInitialRequestsRef.current === 0) {
              setLoading(false);
            }
          } else {
            pendingLoadMoreRequestsRef.current = Math.max(0, pendingLoadMoreRequestsRef.current - 1);
            if (pendingLoadMoreRequestsRef.current === 0) {
              setIsLoadingMore(false);
            }
          }
        }
      },
      [apiBaseUrl, limit, t]
    );

    useEffect(() => {
      setChats([]);
      setHasMore(true);
      setNextSkip(0);
      fetchChats(0, debouncedSearchQuery, true);
    }, [debouncedSearchQuery, fetchChats]);

    useEffect(() => {
      if (isLoadingMore || !hasMore || loading || nextSkip === null || nextSkip === 0) return;

      const observerOptions = {
        root: scrollAreaRef.current,
        rootMargin: "400px",
        threshold: 0.1,
      };

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !loading &&
          nextSkip !== null &&
          nextSkip > 0
        ) {
          fetchChats(nextSkip, debouncedSearchQuery);
        }
      }, observerOptions);

      if (loadMoreRef.current) {
        observer.current.observe(loadMoreRef.current);
      }

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }, [isLoadingMore, hasMore, loading, nextSkip, fetchChats, debouncedSearchQuery]);


    const handleEditChat = useCallback((slug: string, newTitle: string) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.slug === slug ? { ...chat, title: newTitle } : chat
        )
      );
    }, []);

    const handleDeleteChat = useCallback(
      (slug: string) => {
        setDeletedItems((prev) => {
          const updated = new Set(prev);
          updated.add(slug);
          return updated;
        });
        setChats((prevChats) => prevChats.filter((chat) => chat.slug !== slug));
        router.push("/activity");
      },
      [router]
    );

    const handleChatClick = useCallback(
      async (slug: string) => {
        router.push(`/activity/${slug}`);
        if (isMobile) {
          setIsSidebarOpen(false);
        }

        // Optimistically update the UI to remove unread count
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.slug === slug ? { ...chat, unread_count: 0 } : chat
          )
        );

        // Call the read endpoint
        try {
          if (apiBaseUrl) {
            await axios.post(
              `${apiBaseUrl}/api/chat/${slug}/read`,
              {},
              { withCredentials: true }
            );
          }
        } catch (error) {
          console.error("Error marking chat as read:", error);
        }
      },
      [isMobile, setIsSidebarOpen, router, apiBaseUrl]
    );

    const handleNewDocument = useCallback(() => {
      setSearchQuery("");
      setHasMore(true);
      setNextSkip(0);
      setChats([]);
      router.push("/activity");
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    }, [router, isMobile, setIsSidebarOpen]);


    const displayChats = useMemo(() => {
      const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();

      return chats
        .filter((chat) => !deletedItems.has(chat.slug))
        .filter((chat) =>
          chat.title.toLowerCase().includes(normalizedQuery)
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }, [chats, deletedItems, debouncedSearchQuery]);

    return (
        <div className="fixed top-0 left-0 w-full sm:w-80 h-full flex flex-col border-r overflow-hidden z-40 bg-background border-border">

          {/* Primary action */}
          <div className="p-3 border-b border-border flex-shrink-0">
            <button
              onClick={handleNewDocument}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>{t("sidebar.newButton")}</span>
            </button>
          </div>

          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1"
          >
            <div className="flex flex-col">
              {/* Search */}
              <div className="px-4 py-3 sticky top-0 bg-background z-10 shadow-sm border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t("sidebar.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full rounded-xl border border-border bg-accent/80 dark:bg-accent/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="p-3 space-y-1.5 min-h-[50vh]">
                <>
                    {loading && chats.length === 0 ? (
                      <div className="space-y-2 py-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-accent rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : displayChats.length > 0 ? (
                      displayChats.map((chat) => (
                        <ChatHistoryItem
                          key={chat.slug}
                          slug={chat.slug}
                          title={chat.title}
                          date={chat.updated_at}
                          onEdit={handleEditChat}
                          onDelete={handleDeleteChat}
                          onClick={() => handleChatClick(chat.slug)}
                          unreadCount={chat.unread_count}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {debouncedSearchQuery ? t("sidebar.noChatsFound") : t("sidebar.noActivitiesYet")}
                        </p>
                        <button
                          onClick={handleNewDocument}
                          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {t("sidebar.createFirstDocument")}
                        </button>
                      </div>
                    )}

                    {/* Load more trigger */}
                    <div ref={loadMoreRef}>
                      {isLoadingMore && (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-border border-t-foreground" />
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="text-center py-4">
                        <p className="text-destructive text-sm mb-2">{error}</p>
                        <button
                          onClick={() => fetchChats(0, debouncedSearchQuery, true)}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {t('common.retry', { defaultValue: 'Try again' })}
                        </button>
                      </div>
                    )}
                </>
              </div>
            </div>
          </ScrollArea>

          {/* Footer - Compact Actions */}
          <div className="p-3 border-t border-border flex-shrink-0 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-1 px-1">
              <div className="flex items-center gap-1">
                <ThemeSwitcher onOpenChange={onLockedChange} />
              </div>

            </div>
          </div>

        </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;