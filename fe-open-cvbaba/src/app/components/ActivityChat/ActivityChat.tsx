import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ActivityChatProps } from "./ActivityChat.types";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useTranslation } from "@/app/i18n/i18n";
import { useExtractSlug } from "@/app/hooks/useExtractSlug";
import { submitData } from "@/app/hooks/useSubmitData";
import { useStreamSubmitData } from "@/app/hooks/useStreamSubmitData";
import { getTimeBasedGreeting } from "@/app/utils/getTimeBasedGreeting";
import { useFeedback } from "@/app/hooks/useFeedback";
import { useUserImages } from "@/app/hooks/useUserImages";
import { UserProfile, ActivityFormData } from "@/app/types/form";
// Removed AnimatedText as we now render static text inline
import Logo from "../ui/Logo";
import { templates } from "./data/templates";
import ActivityForm from "./ActivityForm";
import CreatePage from "./pages/CreatePage";
import { OpenCvbabaLogo } from "../ui/OpenCvbabaLogo";
import FeedbackToast from "../feedback/FeedbackToast";
import FeedbackFollowUpModal from "../feedback/FeedbackFollowUpModal";
import { PdfPreview } from "../PdfPreview/PdfPreview";
import Modal from "../ui/Modal";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Version {
  id: number;
  chat_id: number;
  pdf_content: string;
  created_at: string;
  version_number: number;
}

const ActivityChat: React.FC<ActivityChatProps> = ({
  includePhoto,
  setIncludePhoto,
  chat,
}) => {
  const { isSidebarOpen } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewRef = useRef<{
    getContent: () => string;
    getSelectedPageIndex?: () => number | null;
    getPageCount?: () => number;
    triggerInsertPage?: (afterIndex: number) => void;
    triggerEditPage?: (pageIndex: number) => void;
    triggerExportPage?: (pageNum: number) => void;
    triggerDeletePage?: (pageIndex: number) => void;
    triggerViewComments?: (pageIndex: number) => void;
    updatePageContent?: (pageIndex: number, content: string) => void;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const { t } = useTranslation("home");
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile] = useState<boolean>(false);
  const [html, setHtml] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'prompt' | 'create'>('prompt');
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<number | undefined>(undefined);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [accessLevel, setAccessLevel] = useState<string | undefined>(undefined);
  const [chatTitle, setChatTitle] = useState<string>(chat?.title || "");
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);

  // Feedback state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentFeedbackAction, setCurrentFeedbackAction] = useState<string>('');
  const { submitBinaryFeedback, submitDetailedFeedback } = useFeedback();

  // User images for avatar
  const { currentAvatar, refreshImages } = useUserImages();

  // const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null); // Replaced with URL state
  const selectedDocumentType = searchParams.get('type');

  const setSelectedDocumentType = (type: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (type) {
      newParams.set('type', type);
      // For poster, always set page count to 1
      if (type === 'poster') {
        setFormData(prev => ({ ...prev, pageCount: 1 }));
      }
    } else {
      newParams.delete('type');
    }
    // Maintain the current mode or default to prompt if not set
    if (!newParams.has('mode')) {
      newParams.set('mode', 'prompt');
    }
    router.push(`/activity?${newParams.toString()}`);
  };
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const { streamSubmitData, cleanup: cleanupStream } = useStreamSubmitData();

  const [formData, setFormData] = useState<ActivityFormData>({
    resumeDescription: "",
    selectedTemplateId: "",
    language: "en",
    pageCount: 1,
    documentSize: "A2" as string,
    documentOrientation: "portrait" as string,
    layoutImageBase64: null,
    layoutImageUrl: null,
  });
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  // Attachment state for unified creation (supports multiple)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [webpageUrls, setWebpageUrls] = useState<string[]>([]);

  // Page tools state (synced from PdfPreview)
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(0);
  const [docPageCount, setDocPageCount] = useState(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const slug = useExtractSlug();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const initialPrompt = searchParams.get('initialPrompt');

    if (initialPrompt) {
      setFormData(prev => ({ ...prev, resumeDescription: initialPrompt }));
    }

    if (mode && ['prompt', 'create'].includes(mode)) {
      setSelectedOption(mode as any);
    } else {
      setSelectedOption('prompt');
    }
  }, [searchParams]);




  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
        streamCleanupRef.current = null;
      }
      cleanupStream();
    };
  }, [cleanupStream]);

  useEffect(() => {
    if (chat?.pdf_content) {
      setHtml(chat.pdf_content);
      // Ensure thinking state is off when chat data is loaded
      setIsThinking(false);
    }
  }, [chat]);

  const fetchVersions = useCallback(async () => {
    if (!slug) return;

    try {
      setIsLoadingVersions(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}/versions`,
        {
          withCredentials: true,
          headers: { Accept: "application/json" },
        }
      );

      const sortedVersions = response.data.sort((a: Version, b: Version) => b.id - a.id);
      console.log('📋 Versions fetched:', sortedVersions.length, 'versions');
      console.log('📋 Versions data:', sortedVersions);
      setVersions(sortedVersions);

      if (sortedVersions.length > 0) {
        setCurrentVersionId(sortedVersions[0].id);
        console.log('✅ Current version set to:', sortedVersions[0].id);
      } else {
        console.log('⚠️ No versions found');
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setIsLoadingVersions(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const fetchChatDetails = useCallback(async () => {
    if (!slug) return;

    // Reset accessLevel when fetching new chat details
    setAccessLevel(undefined);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}`,
        {
          withCredentials: true,
          headers: { Accept: "application/json" },
        }
      );

      if (response.data.access_level !== undefined) {
        setAccessLevel(response.data.access_level);
      }
      if (response.data.title) {
        setChatTitle(response.data.title);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  }, [slug]);

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  const handleVersionChange = async (versionId: number) => {
    try {
      setError(null);

      // Find the selected version
      const selectedVersion = versions.find(v => v.id === versionId);
      if (!selectedVersion) {
        setError(t('activity_chat.errors.version_not_found'));
        return;
      }

      // Update the UI with the selected version content
      setHtml(selectedVersion.pdf_content);
      setCurrentVersionId(versionId);

      // Reset states to reflect the version change
      setPdfUrl("");
      setIsEditMode(true);
      setIsThinking(false); // Ensure thinking indicator is off when switching versions

    } catch (error) {
      console.error("Error selecting version:", error);
      setError(t('activity_chat.errors.version_load_failed'));
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
      setError(null);
    },
    []
  );

  const handlePdfGenerate = async (pages?: string) => {
    if (!slug) {
      toast.error(t('activity_chat.messages.no_document'));
      return;
    }

    const toastId = toast.loading(t('activity_chat.messages.preparing_doc', { format: 'PDF' }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}/export/pdf${pages ? `?pages=${encodeURIComponent(pages)}` : ''}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/pdf',
          },
        }
      );

      if (!response.ok) {
        throw new Error('PDF generation failed.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      toast.update(toastId, {
        render: t('activity_chat.messages.download_success'),
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true
      });

      // Trigger feedback toast after 3 second delay
      setTimeout(() => {
        showFeedbackToast('export_pdf');
      }, 3000);

      // Download directly without switching to preview mode
      const link = document.createElement("a");
      link.href = url;

      const safeTitle = chatTitle
        ? chatTitle.replace(/[^a-z0-9_\- ]/gi, '').replace(/\s+/g, "_")
        : `cv_${userProfile?.full_name?.replace(/\s+/g, "_") || "user"}`;

      const filenameSuffix = pages ? `_pages_${pages.replace(/[^0-9\-]/g, '')}` : '';

      link.download = `${safeTitle}${filenameSuffix}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      toast.update(toastId, {
        render: t('activity_chat.messages.download_failed'),
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true
      });
      setError(t('activity_chat.messages.generation_error', { format: 'PDF' }));
    }
  };

  const updatePdfContent = useCallback(async (htmlContent: string, silent: boolean = false) => {
    if (!slug) {
      console.error("No slug available for update");
      return;
    }

    try {
      await submitData(slug, {
        pdf_content: htmlContent,
      });
      setError(null);
      // Only refresh versions for non-silent saves to avoid page refresh during auto-save
      if (!silent) {
        await fetchVersions();
      }
    } catch (err) {
      console.error("Error updating PDF content:", err);
      setError(t('activity_chat.errors.save_failed'));
    }
  }, [slug, fetchVersions]);

  const handleSave = useCallback(async (silent: boolean = false, content?: string) => {
    if (previewRef.current || content) {
      const updatedHtml = content || (previewRef.current ? previewRef.current.getContent() : "");
      if (updatedHtml) {
        setHtml(updatedHtml);

        try {
          if (!silent) {
            setIsSubmitting(true);
          }
          await updatePdfContent(updatedHtml, silent);
        } catch (error) {
          console.error("Error saving changes:", error);
          if (!silent) {
            setError(t('activity_chat.messages.save_failed'));
          }
        } finally {
          if (!silent) {
            setIsSubmitting(false);
          }
        }
      }
    }
  }, [slug, updatePdfContent]);

  const handleEdit = useCallback(() => {
    setPdfUrl("");
    setIsEditMode(true);
  }, []);

  const handleDownload = useCallback(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const safeFullName = (userProfile?.full_name || "user")
      .replace(/[^a-z0-9_\- ]/gi, '')
      .replace(/\s+/g, "_");

    const safeTitle = chatTitle
      ? chatTitle.replace(/[^a-z0-9_\- ]/gi, '').replace(/\s+/g, "_")
      : `doc_${safeFullName}`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${safeTitle}_${timestamp}_${randomNum}.pdf`;
    link.click();
  }, [pdfUrl, userProfile?.full_name, chatTitle]);

  // Feedback handlers
  const showFeedbackToast = useCallback((action: string) => {
    setCurrentFeedbackAction(action);

    toast(
      ({ closeToast }) => (
        <FeedbackToast
          question={t('feedback.question')}
          onPositive={async () => {
            await submitBinaryFeedback(action, 'positive');
            closeToast?.();

            // Show quality question after positive response
            setTimeout(() => {
              showQualityToast(action);
            }, 300);
          }}
          onNegative={() => {
            closeToast?.();
            setIsFeedbackModalOpen(true);
          }}
          onDismiss={() => {
            closeToast?.();
          }}
        />
      ),
      {
        position: "bottom-center",
        autoClose: 12000,
        hideProgressBar: true,
        closeButton: false,
        className: "feedback-toast",
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
        bodyStyle: { padding: 0 },
        toastId: 'feedback-time-saved',
      }
    );
  }, [t, submitBinaryFeedback]);

  const showQualityToast = useCallback((action: string) => {
    toast(
      ({ closeToast }) => (
        <div className="flex items-center gap-4 pl-6 pr-2 py-2 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-900/20 min-w-[340px] max-w-[420px] animate-in slide-in-from-bottom-8 fade-in duration-300">
          <p className="font-medium text-sm whitespace-nowrap">{t('feedback.quality_question', { defaultValue: 'How was the quality?' })}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={async () => {
                await submitDetailedFeedback(action, 'quality_excellent');
                closeToast?.();
                toast.success(t('feedback.thank_you'), { autoClose: 2000, position: 'bottom-center' });
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {t('feedback.excellent', { defaultValue: 'Excellent' })}
            </button>
            <button
              onClick={async () => {
                await submitDetailedFeedback(action, 'quality_good');
                closeToast?.();
                toast.success(t('feedback.thank_you'), { autoClose: 2000, position: 'bottom-center' });
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {t('feedback.good', { defaultValue: 'Good' })}
            </button>
            <button
              onClick={async () => {
                await submitDetailedFeedback(action, 'quality_fair');
                closeToast?.();
                toast.success(t('feedback.thank_you'), { autoClose: 2000, position: 'bottom-center' });
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {t('feedback.fair', { defaultValue: 'Fair' })}
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-center",
        autoClose: 10000,
        hideProgressBar: true,
        closeButton: false,
        className: "feedback-toast",
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
        bodyStyle: { padding: 0 },
        toastId: 'feedback-quality',
      }
    );
  }, [t, submitDetailedFeedback]);

  const handleFeedbackSubmit = useCallback(async (category: string, comment?: string) => {
    await submitDetailedFeedback(currentFeedbackAction, category, comment);
    toast.success(t('feedback.thank_you'), { autoClose: 2000 });
    setIsFeedbackModalOpen(false);
  }, [currentFeedbackAction, submitDetailedFeedback, t]);


  const handleFixPagination = useCallback(async (overflowPages?: number[]) => {
    if (!slug || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setIsThinking(true);

    try {
      const pageInfo = overflowPages && overflowPages.length > 0
        ? `Page${overflowPages.length > 1 ? 's' : ''} ${overflowPages.join(', ')} overflow${overflowPages.length === 1 ? 's' : ''}.`
        : 'Content overflows page boundaries.';

      const data = {
        user_input: t('activity_chat.prompts.pagination', { info: pageInfo }),
        language: formData.language,
      };

      const response = await submitData(slug, data, formData.selectedTemplateId);

      setHtml(response.pdf_content);
      setPdfUrl("");
      setIsEditMode(true);

      await fetchVersions();

      if (response.pdf_content) {
        setTimeout(() => {
          setIsThinking(false);
        }, 300);
      } else {
        setIsThinking(false);
      }
    } catch (error) {
      console.error("Error fixing pagination:", error);
      setError(t('activity_chat.errors.pagination_fix_failed'));
      setIsThinking(false);
    } finally {

      setIsSubmitting(false);
    }
  }, [slug, formData.language, formData.selectedTemplateId, isSubmitting, fetchVersions]);




  const handleCommentsStateChange = useCallback((isOpen: boolean) => {
    setIsCommentsOpen(isOpen);
  }, []);

  // Sanitize streamed HTML: remove markdown fences and leading artifacts
  const sanitizeStreamingHtml = useCallback((text: string) => {
    let t = text;
    // Remove leading code fence with optional language
    t = t.replace(/^\s*```\s*html\s*\n?/i, "");
    t = t.replace(/^\s*```\s*\n?/, "");
    // Sometimes models emit just "html" at start; drop it if before first tag
    t = t.replace(/^\s*html\s*(?=<)/i, "");
    // Remove any stray closing fences that may appear mid-stream
    t = t.replace(/```/g, "");
    return t;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!formData.resumeDescription.trim()) {
        setError(t('activity_chat.messages.provide_description'));
        return;
      }

      if (isSubmitting) return;

      // Cleanup any existing stream
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
        streamCleanupRef.current = null;
      }

      setIsSubmitting(true);
      setError(null);
      setIsThinking(true);
      setStreamingHtml("");

      let userInputMessage = formData.resumeDescription;
      userInputMessage += t('activity_chat.prompts.language_suffix', { language: formData.language });

      // Append page count instruction for new documents
      if (!slug && formData.pageCount) {
        userInputMessage += `\n\nTarget Length: ${formData.pageCount} page${formData.pageCount > 1 ? 's' : ''}.`;
      }

      if (includePhoto && currentAvatar) {
        userInputMessage += t('activity_chat.prompts.include_photo', { url: currentAvatar });
      }

      const data: any = {
        user_input: userInputMessage,
        template_id: formData.selectedTemplateId,
        language: formData.language,
      };

      if (!slug && formData.pageCount) {
        data.num_pages = formData.pageCount;
      }

      // Add new optional fields for document creation
      if (selectedDocumentType) {
        data.document_type = selectedDocumentType;
      }
      if (formData.documentSize) {
        data.document_size = formData.documentSize;
      }


      // Add photo data only if present to minimize payload mismatch risk
      if (includePhoto && currentAvatar) {
        data.include_photo = true;
        data.profile_photo_url = currentAvatar;
      }

      // Add visual sketch layout if present
      if (formData.layoutImageBase64) {
        data.layout_image_base64 = formData.layoutImageBase64;
      }
      if (formData.layoutImageUrl) {
        data.layout_image_url = formData.layoutImageUrl;
      }

      // Unified Multimodal Creation: Use FormData if attachments are present
      let submissionData: any = data;
      const hasAttachments = attachedFiles.length > 0 || youtubeUrls.length > 0 || webpageUrls.length > 0;

      if (hasAttachments) {
        const formDataObj = new FormData();

        // Append standard fields
        Object.keys(data).forEach(key => {
          formDataObj.append(key, data[key]);
        });

        // Append files (max 5)
        attachedFiles.forEach(file => {
          formDataObj.append('files', file);
        });

        // Append YouTube URLs (max 3, comma-separated)
        if (youtubeUrls.length > 0) {
          formDataObj.append('youtube_urls', youtubeUrls.join(','));
        }

        // Append webpage URLs (max 5, comma-separated)
        if (webpageUrls.length > 0) {
          formDataObj.append('webpage_urls', webpageUrls.join(','));
        }

        submissionData = formDataObj;
      }

      // Try streaming first, fallback to blocking if it fails
      let useStreaming = true;
      const handleStreamError = async (message: string) => {
        console.warn("Streaming failed, falling back to blocking endpoint:", message);
        useStreaming = false;

        // Fallback to blocking endpoint
        try {
          const response = await submitData(slug, submissionData);

          if (!slug && response.slug) {
            router.push(`/activity/${response.slug}`);
            // Clear attachments on success
            setAttachedFiles([]);
            setYoutubeUrls([]);
            setWebpageUrls([]);
            return;
          }

          setHtml(response.pdf_content);
          setPdfUrl("");
          setIsEditMode(true);

          if (slug) {
            await fetchVersions();
          }

          // Clear attachments on success
          setAttachedFiles([]);
          setYoutubeUrls([]);
          setWebpageUrls([]);

          if (response.pdf_content) {
            setTimeout(() => {
              setIsThinking(false);
            }, 300);
          } else {
            setIsThinking(false);
          }
        } catch (error) {
          handleBlockingError(error);
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleBlockingError = (error: unknown) => {
        console.error("Error during submission:", error);
        if (axios.isAxiosError(error)) {
          const responseError = error.response?.data;

          if (responseError && Array.isArray(responseError.detail)) {
            const errorDetail = responseError.detail[0];
            if (errorDetail.type === "string_too_long") {
              setError(t('errors.input_too_long'));
            } else {
              setError(t('errors.assistantError'));
            }
          } else {
            setError(t('errors.submissionError'));
          }
        } else {
          setError(t('errors.submissionError'));
        }
        setIsThinking(false);
      };

      // Try streaming
      try {
        // For existing documents, use edit-page endpoint to update specific page
        const isEditingPage = !!slug && selectedPageIndex !== null && selectedPageIndex !== undefined;

        const streamOptions = isEditingPage
          ? { endpoint: `/api/chat/${slug}/edit-page/stream`, method: 'POST' }
          : undefined;

        // Build streamData - for page editing, now uses JSON with pre-uploaded file URL
        let streamData: Record<string, any> | FormData;
        if (isEditingPage) {
          let userInputWithFile = formData.resumeDescription;

          // If file is attached, upload it first and append URL to user_input
          if (attachedFiles.length > 0) {
            try {
              const uploadFormData = new FormData();
              uploadFormData.append('file', attachedFiles[0]);

              const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
                {
                  method: 'POST',
                  credentials: 'include',
                  body: uploadFormData,
                }
              );

              if (uploadResponse.ok) {
                const uploadResult = await uploadResponse.json();
                if (uploadResult.file_url) {
                  userInputWithFile += `\n\n[Attached file: ${uploadResult.file_url}]`;
                }
              }
            } catch (uploadError) {
              console.error('Failed to upload file for page edit:', uploadError);
              // Continue without the file URL
            }
          }

          // If a user image was selected via the modal, append it
          if (selectedImageUrl) {
            userInputWithFile += `\n\n[Image: ${selectedImageUrl}]`;
          }

          streamData = {
            page_number: selectedPageIndex + 1,
            user_input: userInputWithFile,
          };
        } else {
          streamData = submissionData;
        }


        // Content buffer for page editing
        let pageContentBuffer = '';

        const cleanup = streamSubmitData(
          slug,
          streamData,
          {
            onChunk: (content: string) => {
              if (isEditingPage) {
                // For page editing, accumulate content and update specific page
                pageContentBuffer += content;

                // Update the page in PdfPreview's shadow DOM via previewRef
                if (previewRef.current && 'updatePageContent' in previewRef.current) {
                  (previewRef.current as any).updatePageContent(selectedPageIndex, pageContentBuffer);
                }

                // Also update the main html state for consistency
                setStreamingHtml(pageContentBuffer);
              } else {
                // For new documents, append sanitized chunk to streaming HTML
                setStreamingHtml((prev) => {
                  const combined = prev + content;
                  const sanitized = sanitizeStreamingHtml(combined);
                  setHtml(sanitized);
                  return sanitized;
                });
              }
              // Hide thinking indicator and set streaming flag when first chunk arrives
              if (isThinking) {
                setIsThinking(false);
              }
              if (!isStreaming) {
                setIsStreaming(true);
              }
            },
            onComplete: async (chat: any) => {
              // Stream complete, finalize - use chat.pdf_content if available, otherwise keep current html
              if (chat.pdf_content) {
                setHtml(chat.pdf_content);
              }
              setStreamingHtml("");
              setPdfUrl("");
              setIsEditMode(true);
              setIsStreaming(false);

              // Clear attachments on success
              setAttachedFiles([]);
              setYoutubeUrls([]);
              setWebpageUrls([]);

              if (!slug && chat.slug) {
                router.push(`/activity/${chat.slug}`);
                return;
              }

              if (slug) {
                await fetchVersions();
                // Save after page edit
                if (isEditingPage && previewRef.current && 'commitEdits' in (previewRef.current as any)) {
                  // Trigger save
                }
              }

              // Clear form after successful edit
              setFormData(prev => ({ ...prev, resumeDescription: '', layoutImageBase64: null, layoutImageUrl: null }));

              setIsThinking(false);
              setIsSubmitting(false);
              streamCleanupRef.current = null;
            },
            onError: handleStreamError,
          },
          streamOptions
        );

        streamCleanupRef.current = cleanup || null;
      } catch (error) {
        // If streaming setup fails, fallback immediately
        await handleStreamError("Stream setup failed");
      }
    },

    [
      formData,
      includePhoto,
      router,
      slug,
      userProfile,
      t,
      fetchVersions,
      streamSubmitData,
      isSubmitting,
      selectedDocumentType,
      attachedFiles,
      youtubeUrls,
      webpageUrls,
      selectedPageIndex,
      currentAvatar
    ]
  );

  // Auto-submit effect
  useEffect(() => {
    if (shouldAutoSubmit && formData.resumeDescription && formData.selectedTemplateId && formData.language) {
      // Create a synthetic event
      const syntheticEvent = {
        preventDefault: () => { },
      } as React.FormEvent<HTMLFormElement>;

      handleSubmit(syntheticEvent);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, formData, handleSubmit]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <OpenCvbabaLogo className="w-12 h-12 text-black dark:text-white animate-bounce" />
          <div className="text-black dark:text-gray-100 text-sm">{t('activity_chat.messages.loading')}</div>
        </div>
      </div>
    );
  }

  const usergreeting =
    t(getTimeBasedGreeting()) + " " + (userProfile?.full_name?.split(" ")[0] || t('activity_chat.user'));

  // Handler functions for page interactions

  const handleCreateOptionSelect = (option: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('type', option);
    newParams.set('mode', 'prompt');

    setFormData(prev => ({ ...prev, resumeDescription: "" }));
    router.push(`/activity?${newParams.toString()}`);
  };

  const handleTemplateSelection = (templateId: string) => {
    setFormData(prev => ({ ...prev, selectedTemplateId: templateId }));

    // Infer document type from template
    const selectedTemplate = templates.find(t => t.id === templateId);
    let newDocType: string | null = null;

    if (selectedTemplate) {
      if (selectedTemplate.type === 'CV') {
        newDocType = 'cv';
      } else if (selectedTemplate.type === 'Letter') {
        newDocType = 'letter';
      }
    }

    const newParams = new URLSearchParams(searchParams.toString());
    if (newDocType) newParams.set('type', newDocType);
    else newParams.delete('type');
    newParams.set('mode', 'prompt');

    router.push(`/activity?${newParams.toString()}`);
  };




  const handleUploadComplete = (data: {
    extractedText: string;
    documentType: string;
    templateId: string;
    language: string;
  }) => {
    // Generate a clear prompt based on document type
    const documentTypePrompts: Record<string, string> = {
      'cv': t('activity_chat.prompts.upload.cv'),
      'cover-letter': t('activity_chat.prompts.upload.cover_letter'),
      'sop': t('activity_chat.prompts.upload.sop'),
      'personal-statement': t('activity_chat.prompts.upload.personal_statement'),
      'recommendation': t('activity_chat.prompts.upload.recommendation'),
      'proposal': t('activity_chat.prompts.upload.proposal'),
    };

    const prompt = documentTypePrompts[data.documentType] || t('activity_chat.prompts.upload.default');
    const fullPrompt = prompt + data.extractedText;

    setFormData(prev => ({
      ...prev,
      resumeDescription: fullPrompt,
      selectedTemplateId: data.templateId,
      language: data.language,
    }));
    setSelectedDocumentType(data.documentType);
    router.push('/activity?mode=prompt');
    setShouldAutoSubmit(true);
  };




  const handleTranslateComplete = (data: {
    extractedText: string;
    documentType: string;
    templateId: string;
    language: string;
  }) => {
    // Generate a clear prompt for translation
    const prompt = t('activity_chat.prompts.translate', { type: data.documentType, language: data.language });

    const fullPrompt = prompt + data.extractedText;

    setFormData(prev => ({
      ...prev,
      resumeDescription: fullPrompt,
      selectedTemplateId: data.templateId,
      language: data.language,
    }));
    setSelectedDocumentType(data.documentType);
    router.push('/activity?mode=prompt');
    setShouldAutoSubmit(true);
  };

  // Render full-page views for each option
  if (!slug && selectedOption === 'create') {
    return (
      <CreatePage
        onComplete={({ documentType, templateId, language }) => {
          setFormData((prev) => ({ ...prev, selectedTemplateId: templateId, language, resumeDescription: '' }));
          setSelectedDocumentType(documentType);
          router.push('/activity?mode=prompt&type=' + documentType);
        }}
        initialDocumentType={selectedDocumentType === 'cover-letter' ? 'cover-letter' : 'cv'}
        onBack={() => router.push('/activity')}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50/50 dark:bg-black transition-colors duration-300">
      <div className="container mx-auto h-full flex flex-col p-4 gap-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-center mx-4 sm:mx-6 shadow-soft">
            {error}
          </div>
        )}



        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-x-hidden gap-4">
          {(html || isThinking || streamingHtml) && (
            <div
              className={clsx(
                "w-full order-1 lg:order-2 transition-all duration-300",
                (isThinking && !streamingHtml) || accessLevel === 'view' || isCommentsOpen ? "w-full" : "flex-1 min-w-0"
              )}
            >
              <div className={clsx(
                "w-full h-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800",
                (isThinking && !streamingHtml) && "flex items-center justify-center"
              )}>
                {(isThinking && !streamingHtml) ? (
                  <div className="flex flex-col items-center space-y-4">
                    <OpenCvbabaLogo className="w-16 h-16 text-black dark:text-white animate-pulse" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('activity_chat.isThinking')}</p>
                  </div>
                ) : (
                  <PdfPreview
                    html={html}
                    pdfUrl={pdfUrl}
                    error={error || ""}
                    fullName={userProfile?.full_name || ""}
                    previewRef={previewRef}
                    isSubmitting={isSubmitting}
                    isEditMode={isEditMode}
                    onPdfGenerate={handlePdfGenerate}
                    onSave={handleSave}
                    onEdit={handleEdit}
                    onDownload={handleDownload}
                    versions={versions}
                    currentVersionId={currentVersionId}
                    onVersionChange={handleVersionChange}
                    isLoadingVersions={isLoadingVersions}
                    onFixPagination={handleFixPagination}
                    isStreaming={isStreaming}
                    chatSlug={slug ?? undefined}
                    accessLevel={accessLevel}
                    onCommentsStateChange={handleCommentsStateChange}
                    onRefreshVersions={fetchVersions}
                    onSelectedPageChange={setSelectedPageIndex}
                    onPageCountChange={setDocPageCount}
                  />
                )}
              </div>
            </div>
          )}

          {/* Form Section - hidden during initial thinking state, for view-only access, and when comments are open */}
          {!(isThinking && !streamingHtml) && accessLevel !== 'view' && !isCommentsOpen && (
            <div
              className={clsx(
                "w-full order-2 lg:order-1 flex-shrink-0 transition-all duration-300",
                (html || isThinking || streamingHtml) ? "lg:w-1/3 lg:min-w-[350px] lg:max-w-[400px]" : "w-full"
              )}
            >
              <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800 overflow-hidden transition-colors duration-300 relative">
                {/* Portal Target for overlaying Sidebar content (e.g. Add Page Form) */}
                <div id="sidebar-overlay-portal" className="absolute inset-0 z-50 pointer-events-none [&>*]:pointer-events-auto" />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {isSubmitting ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300">
                        <Loader2 className="w-8 h-8 text-gray-900 dark:text-gray-100 animate-spin" />
                      </div>

                      <div className="space-y-2 max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {t('activity_chat.messages.creating_doc')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('activity_chat.messages.preview_wait')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ActivityForm
                      formData={formData}
                      setFormData={setFormData}
                      onInputChange={handleInputChange}
                      includePhoto={includePhoto}
                      setIncludePhoto={setIncludePhoto}
                      onSubmit={handleSubmit}
                      isLoading={isSubmitting}
                      userProfile={userProfile}
                      setUserProfile={setUserProfile}
                      hasExistingChat={!!slug || !!chat}
                      selectedDocumentType={selectedDocumentType}
                      setSelectedDocumentType={setSelectedDocumentType}
                      // Attachment props (multiple files and URLs)
                      attachedFiles={attachedFiles}
                      setAttachedFiles={setAttachedFiles}
                      youtubeUrls={youtubeUrls}
                      setYoutubeUrls={setYoutubeUrls}
                      webpageUrls={webpageUrls}
                      setWebpageUrls={setWebpageUrls}

                      // Page tools props - use reactive state synced from PdfPreview
                      selectedPageIndex={selectedPageIndex}
                      pageCount={docPageCount}
                      onInsertPage={(afterIndex) => previewRef.current?.triggerInsertPage?.(afterIndex)}
                      onEditPage={(pageIndex) => previewRef.current?.triggerEditPage?.(pageIndex)}
                      onViewComments={(pageIndex) => previewRef.current?.triggerViewComments?.(pageIndex)}
                      onExportPage={(pageNum) => previewRef.current?.triggerExportPage?.(pageNum)}
                      onDeletePage={(pageIndex) => previewRef.current?.triggerDeletePage?.(pageIndex)}
                    />
                  )}
                </div>
                {/* Portal Target for Thumbnail Strip */}
                <div id="pdf-thumbnail-strip-portal" className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 transition-colors empty:hidden flex-shrink-0 max-h-24 overflow-hidden" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revert action moved to overflow menu in PdfPreview component for cleaner UX */}


      {/* Feedback Follow-up Modal */}
      <FeedbackFollowUpModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default React.memo(ActivityChat);