// ActivityForm.tsx
import React, { useState, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { useAnimatedPlaceholder } from '@/app/hooks/useAnimatedPlaceholder';
import { Loader2, ArrowRight, Camera, ChevronDown, Type, Wand2, GraduationCap, Briefcase, Crown, Users, RefreshCw, Languages, Target, Star, BarChart3, X, Linkedin, PenTool, Search, Layers, Paperclip, FileText, FilePlus, Edit2, Trash2, Download, MessageSquare, Mic, MicOff, ImagePlus } from 'lucide-react';
import Label from '../ui/Label';
import Textarea from '../ui/Textarea';
import { AutoResizeTextarea } from '../ui/AutoResizeTextarea';
import axios from 'axios';
import TranslateModal from './TranslateModal';
import ATSModal from './ATSModal';
import StyleModal from './StyleModal';
import JustifyModal from './JustifyModal';
import { SketchCanvasModal } from '../SketchCanvas/SketchCanvasModal';

import { languageOptions, getLanguageShortName } from '@/app/config/languages';
import type { ActivityFormData, UserProfile } from '@/app/types/form';
import { useSpeechToText } from '@/app/hooks/useSpeechToText';
import { useUserImages } from '@/app/hooks/useUserImages';
import TemplateSelector from './TemplateSelector';
import { templates } from './data/templates';

interface ActivityFormProps {
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  includePhoto: boolean;
  setIncludePhoto: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  hasExistingChat?: boolean; // New prop to indicate if there's an existing chat/slug
  // Page tools props
  selectedPageIndex?: number | null;
  pageCount?: number;
  onInsertPage?: (afterIndex: number) => void;
  onEditPage?: (pageIndex: number) => void;
  onDeletePage?: (pageIndex: number) => void;
  onExportPage?: (pageNum: number) => void;
  onInsertImage?: (pageNum: number) => void;
  // Attachment props (supports multiple)
  attachedFiles: File[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onViewComments?: (pageIndex: number) => void;
  // Selected image for page editing
  selectedImageUrl?: string | null;
  setSelectedImageUrl?: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormField: React.FC<{
  id: keyof ActivityFormData;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}> = React.memo(({ id, label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <Textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-[100px] w-full rounded-lg border border-gray-300 p-3 resize-y transition-colors hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-gray-900"
    />
  </div>
));

const ActivityForm: React.FC<ActivityFormProps> = ({
  formData,
  setFormData,
  onInputChange,
  includePhoto,
  setIncludePhoto,
  onSubmit,
  isLoading,
  userProfile,
  setUserProfile,
  hasExistingChat = false,
  // Page tools
  selectedPageIndex,
  pageCount = 0,
  onInsertPage,
  onEditPage,
  onDeletePage,
  onExportPage,
  onInsertImage,
  // Attachment props (multiple)
  attachedFiles,
  setAttachedFiles,
  onViewComments,
  // Selected image
  selectedImageUrl: selectedImageUrlProp,
  setSelectedImageUrl: setSelectedImageUrlProp,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  // User images for avatar
  const { currentAvatar, refreshImages } = useUserImages();

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [isPhotoDropdownOpen, setIsPhotoDropdownOpen] = useState(false);

  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false);

  // Multimodal attachment state
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // User images list for page editing
  interface UserImage {
    id: number;
    slug?: string;
    file_url: string;
    filename: string;
    created_at: string;
  }
  const [userImagesList, setUserImagesList] = useState<UserImage[]>([]);
  const [isLoadingUserImages, setIsLoadingUserImages] = useState(false);
  const [isUserImagesModalOpen, setIsUserImagesModalOpen] = useState(false);
  // Use prop if provided, otherwise use local state
  const [localSelectedImageUrl, setLocalSelectedImageUrl] = useState<string | null>(null);
  const selectedImageUrl = selectedImageUrlProp ?? localSelectedImageUrl;
  const setSelectedImageUrl = setSelectedImageUrlProp ?? setLocalSelectedImageUrl;

  const handleDeleteImage = async (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/user/images/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUserImagesList(prev => prev.filter(img => (img.slug || img.id.toString()) !== slug));
        // If the deleted image was selected, clear selection
        if (selectedImageUrl && userImagesList.find(img => (img.slug || img.id.toString()) === slug)?.file_url === selectedImageUrl) {
          setSelectedImageUrl(null);
        }
      } else {
        console.error('Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  // Speech-to-text integration
  // Google STT 'long' model requires specific region codes (e.g. fr-FR, not just fr)
  const getFullLocale = (code?: string) => {
    if (!code) return 'en-US';
    // If it's already a full locale (has hyphen), use it
    if (code.includes('-')) return code;

    // Map short codes to default regions
    const defaults: Record<string, string> = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'es': 'es-ES',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'zh': 'zh-CN',
      'ar': 'ar-SA'
    };
    return defaults[code] || 'en-US';
  };

  // Use input_language from profile for STT, fallback to formData.language
  const speechLanguage = getFullLocale(userProfile?.input_language || formData.language);
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechToText({ language: speechLanguage });

  // Sync transcript to form when speech recognition produces results
  useEffect(() => {
    if (transcript) {
      setFormData(prev => ({
        ...prev,
        resumeDescription: prev.resumeDescription
          ? prev.resumeDescription + ' ' + transcript
          : transcript,
      }));
      clearTranscript();
    }
  }, [transcript, setFormData, clearTranscript]);

  // Fetch user images when in page edit mode
  useEffect(() => {
    if (hasExistingChat && selectedPageIndex !== null && selectedPageIndex !== undefined) {
      setIsLoadingUserImages(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/user/images`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUserImagesList(data);
          }
        })
        .catch(err => console.error('Failed to fetch user images:', err))
        .finally(() => setIsLoadingUserImages(false));
    }
  }, [hasExistingChat, selectedPageIndex]);

  // Animated Placeholder Logic
  const creationPlaceholders: Record<string, string[]> = {
    default: ['Describe the role you are targeting and your professional background.'],
    cv: ['Describe the role you are targeting and your professional background.'],
  };
  const improvementPlaceholders: Record<string, string[]> = creationPlaceholders;

  const allAnimatedPlaceholders = hasExistingChat ? improvementPlaceholders : creationPlaceholders;

  let currentPlaceholders: string[] = [];

  if (allAnimatedPlaceholders && typeof allAnimatedPlaceholders === 'object' && !Array.isArray(allAnimatedPlaceholders)) {
    let typeKey = 'default';
    if (true) {
      typeKey = 'cv';
    }
    // @ts-ignore
    currentPlaceholders = allAnimatedPlaceholders[typeKey] || allAnimatedPlaceholders['default'] || [];
  }

  // Fallback
  if (!currentPlaceholders || currentPlaceholders.length === 0) {
    currentPlaceholders = ["..."];
  }

  const placeholderPrefix = hasExistingChat
    ? "Describe the changes you want to make to your CV."
    : "Describe the CV you want to create.";

  const animatedPlaceholder = useAnimatedPlaceholder({
    placeholders: currentPlaceholders,
    prefix: placeholderPrefix + " ",
    typingSpeed: 50,
    deletingSpeed: 30,
    pauseDuration: 2500
  });

  // selectedDocumentType is now passed as a prop
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const photoDropdownRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Check if resumeDescription already has content.
  const hasResumeContent = formData.resumeDescription.trim().length > 0;

  // Use shared language options (imported at top of file)

  // Filter languages based on search term
  const filteredLanguages = languageOptions.filter(option =>
    option.language.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
    option.region.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  // Sync with user profile output language or localStorage
  useEffect(() => {
    if (userProfile?.output_language) {
      setFormData(prev => ({ ...prev, language: userProfile.output_language }));
    } else {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setFormData(prev => ({ ...prev, language: savedLanguage }));
      }
    }
  }, [userProfile?.output_language, setFormData]);


  // Form now appears inline - no modal needed


  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  // Close photo dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (photoDropdownRef.current && !photoDropdownRef.current.contains(event.target as Node)) {
        setIsPhotoDropdownOpen(false);
      }
    };

    if (isPhotoDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPhotoDropdownOpen]);

  const updateProfileLanguage = async (lang: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
        { output_language: lang },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (setUserProfile) {
        setUserProfile(prev => prev ? ({ ...prev, output_language: lang }) : null);
      }
    } catch (error) {
      console.error("Failed to update language preference", error);
    }
  };

  const handleLanguageSelect = (languageValue: string) => {
    setFormData(prev => ({ ...prev, language: languageValue }));
    localStorage.setItem('selectedLanguage', languageValue);
    updateProfileLanguage(languageValue);
    setIsLanguageDropdownOpen(false);
  };

  const getSelectedLanguageOption = () => {
    const selected = languageOptions.find(option => option.value === formData.language) || languageOptions[0];
    return {
      ...selected,
      label: getLanguageShortName(selected.value)
    };
  };



  const handleFileUpload = useCallback(async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);

    const response = await axios.post<{ file_url: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to upload file');
    }
    return response.data.file_url;
  }, []);

  const handleFileExtract = useCallback(async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);

    const response = await axios.post<{ extracted_text: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/extract_text`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to extract text from file');
    }
    return response.data.extracted_text;
  }, []);

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        setPhotoFile(file);
        await handleFileUpload(file);
        // Refresh images list to get the new avatar
        await refreshImages();
      } catch (error) {
        console.error('Error uploading photo:', error);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    // Just toggle the include photo setting off
    setIncludePhoto(false);
  };

  const handleDocumentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingDocument(true);
        const extractedText = await handleFileExtract(file);
        setFormData(prev => ({ ...prev, resumeDescription: extractedText }));
        // Switch to prompt mode after successful upload
      } catch (error) {
        console.error('Error extracting text from file:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsUploadingDocument(false);
        // Reset the input so the same file can be selected again if needed
        if (uploadInputRef.current) {
          uploadInputRef.current.value = '';
        }
      }
    }
  };


  const isFormValid =
    Boolean(formData.resumeDescription.trim());





  // Handle form submission
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      // Only submit if form is valid and not loading
      if (isFormValid && !isLoading) {
        e.preventDefault();
        // Create a synthetic form event
        const syntheticEvent = {
          preventDefault: () => { },
          currentTarget: e.currentTarget.form,
        } as React.FormEvent<HTMLFormElement>;
        onSubmit(syntheticEvent);
      }
    }
  };


  // Handle paste events for images and files
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData?.items) {
      const items = Array.from(e.clipboardData.items);
      const files: File[] = [];

      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            // For page editing (hasExistingChat), only accept images
            // For new chats, accept documents
            if (hasExistingChat) {
              if (file.type.startsWith('image/')) {
                files.push(file);
              }
            } else {
              if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
                files.push(file);
              }
            }
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        const remaining = hasExistingChat ? 1 - attachedFiles.length : 5 - attachedFiles.length;
        if (remaining > 0) {
          setAttachedFiles(prev => [...prev, ...files.slice(0, remaining)]);
        }
      }
    }
  };

  return (
    <div className={hasExistingChat ? "h-full flex flex-col" : "min-h-screen py-8"}>
      <div className={hasExistingChat ? "flex-1 flex flex-col justify-end" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <form
          onSubmit={handleSubmitForm}
          className={hasExistingChat ? "w-full space-y-4" : "space-y-6 w-full max-w-2xl mx-auto dark:text-gray-100"}
        >
          {!hasExistingChat && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a CV template</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Optional. Start from a template or leave this blank for a custom layout.
                </p>
              </div>
              <TemplateSelector
                templates={templates}
                selectedTemplateId={formData.selectedTemplateId}
                onSelectTemplate={(templateId) =>
                  setFormData((previous) => ({
                    ...previous,
                    selectedTemplateId: previous.selectedTemplateId === templateId ? '' : templateId,
                  }))
                }
              />
            </section>
          )}

          {/* Page Tools - Only show for existing documents */}
          {hasExistingChat && selectedPageIndex !== null && selectedPageIndex !== undefined && (
            <div className="space-y-3">
              {/* Page indicator */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white dark:text-gray-900">{selectedPageIndex + 1}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {"Page"} {selectedPageIndex + 1}
                  </span>
                  {pageCount > 1 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {"of"} {pageCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Page Actions Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onInsertPage?.(selectedPageIndex)} className="group flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <FilePlus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">{"Insert"}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">{"Add new page"}</div>
                  </div>
                </button>



                {/* Insert Image Tool - HIDDEN */}
                {false && (
                  <button type="button" onClick={() => onInsertImage?.((selectedPageIndex ?? 0) + 1)} className="group flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all">
                    <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <ImagePlus className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">{"Image"}</div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400">{"Add to page"}</div>
                    </div>
                  </button>
                )}



                {pageCount > 1 && (
                  <button type="button" onClick={() => onDeletePage?.(selectedPageIndex)} className="group flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all">
                    <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-red-900 dark:text-red-100">{"Delete"}</div>
                      <div className="text-[10px] text-red-600 dark:text-red-400">{"Remove page"}</div>
                    </div>
                  </button>
                )}
              </div>

              {/* Images Button */}
              <button
                type="button"
                onClick={() => setIsUserImagesModalOpen(true)}
                className={`group flex items-center gap-3 p-3 border rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all w-full ${selectedImageUrl
                  ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600'
                  : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                  }`}
              >
                {selectedImageUrl ? (
                  <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-purple-400">
                    <img src={selectedImageUrl} alt="Selected" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <ImagePlus className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="text-left flex-1">
                  <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    {selectedImageUrl ? "Image Selected" : "Your Images"}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400">
                    {selectedImageUrl
                      ? "Click to change"
                      : isLoadingUserImages
                        ? "Loading..."
                        : `${userImagesList.length} ${"images"}`
                    }
                  </div>
                </div>
                {selectedImageUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageUrl(null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                    title={"Remove"}
                  >
                    <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </button>
                )}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700"></div>
            </div>
          )}


          {/* Inline Options Row - Hide on slug pages */}
          {!hasExistingChat && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Language Dropdown */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all min-w-0 ${formData.language
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                >
                  <Languages className={`h-4 w-4 ${formData.language ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>{getSelectedLanguageOption().label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''} ${formData.language ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto w-80">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {filteredLanguages.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleLanguageSelect(option.value)}
                          className={`px-3 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors rounded-md ${formData.language === option.value ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{getLanguageShortName(option.value)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.region}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Page Count (Only for new chat, hidden for poster) */}
                <div className="relative">
                  <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">{"Pages:"}</span>
                    <select
                      value={formData.pageCount || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) }))}
                      className="bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-gray-100 focus:ring-0 cursor-pointer py-0 pl-1 pr-6"
                      style={{ backgroundImage: 'none' }}
                    >
                      {[...Array(70)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-3 w-3 text-gray-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>


              {/* Document Orientation Selector - HIDDEN (Backend handles this) */}

              {/* Photo Dropdown - Only show when user has a profile photo */}
              {/* Photo Dropdown - HIDDEN */}
              {false && currentAvatar && (
                <div className="relative" ref={photoDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsPhotoDropdownOpen(!isPhotoDropdownOpen)}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all min-w-0 ${includePhoto
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                  >
                    <Camera className={`h-4 w-4 ${includePhoto ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span>{includePhoto ? 'Photo' : "Photo"}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isPhotoDropdownOpen ? 'rotate-180' : ''} ${includePhoto ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  </button>

                  {isPhotoDropdownOpen && (
                    <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-80">
                      <div className="p-4">
                        <div className="space-y-4">
                          {currentAvatar && (
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setIncludePhoto(!includePhoto);
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${includePhoto ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-650'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includePhoto ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          )}

                          <div className="flex justify-center">
                            {currentAvatar ? (
                              <div className="relative group">
                                <div className="relative w-24 h-24">
                                  <img
                                    src={currentAvatar ?? undefined}
                                    alt={"Profile"}
                                    className="w-full h-full rounded-xl object-cover border-2 border-white dark:border-gray-800 shadow-lg"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                                    <label
                                      htmlFor="photo-upload"
                                      className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition-all duration-200 hover:scale-110"
                                    >
                                      {isUploadingPhoto ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
                                      ) : (
                                        <Camera className="w-4 h-4 text-gray-900" />
                                      )}
                                      <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={isUploadingPhoto}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div className="mt-2 text-center">
                                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{"Photouploaded"}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{"Hovertochange"}</p>
                                  <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    disabled={isUploadingPhoto}
                                    className="mt-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline disabled:opacity-50"
                                  >
                                    {isUploadingPhoto ? "Removing" : "Remove"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full">
                                <label
                                  htmlFor="photo-upload-new"
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
                                >
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-300">
                                      <Camera className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{"Uploadphoto"}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{"Clicktobrowse"}</p>
                                    </div>
                                    {isUploadingPhoto && (
                                      <div className="flex items-center space-x-1 text-gray-900 dark:text-gray-200">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span className="text-xs">{"Uploading"}</span>
                                      </div>
                                    )}
                                  </div>
                                  <input
                                    id="photo-upload-new"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    disabled={isUploadingPhoto}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Input Field with Submit Button */}
          <div className="space-y-3">
            <div className="relative">
              <AutoResizeTextarea
                id="resumeDescription"
                name="resumeDescription"
                value={
                  isListening && interimTranscript
                    ? formData.resumeDescription
                      ? formData.resumeDescription + ' ' + interimTranscript
                      : interimTranscript
                    : formData.resumeDescription

                }
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={isListening ? "Listening... speak now" : animatedPlaceholder}
                className={`text-base pr-24 ${isListening ? 'border-red-300 dark:border-red-700 ring-2 ring-red-200 dark:ring-red-900/30' : ''}`}
                minHeight={120}
                maxHeight={400}
                smoothTransition={true}
                maxLength={15000}
                variant="default"
                disabled={isListening}
              />

              {/* Microphone Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    // Save any pending interim transcript before stopping
                    if (interimTranscript) {
                      setFormData(prev => ({
                        ...prev,
                        resumeDescription: prev.resumeDescription
                          ? prev.resumeDescription + ' ' + interimTranscript
                          : interimTranscript,
                      }));
                    }
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                disabled={isLoading}
                className={`absolute bottom-3 right-14 p-2.5 rounded-full transition-all duration-200 ${isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                title={isListening ? "Click to stop" : "Voice input"}
              >
                <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid || isListening}
                className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${isLoading || !isFormValid || isListening
                  ? 'opacity-50 cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Attachment Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Hidden file input for attachments - Only for new chats */}

              <>
                <input
                  type="file"
                  ref={attachmentInputRef}
                  className="hidden"
                  accept={hasExistingChat ? "image/*" : ".pdf,.doc,.docx,.txt"}
                  multiple={!hasExistingChat}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const remaining = 5 - attachedFiles.length;
                    if (files.length > 0 && remaining > 0) {
                      setAttachedFiles(prev => [...prev, ...files.slice(0, remaining)]);
                    }
                    e.target.value = ''; // Reset input
                  }}
                />

                {/* Attached files chips */}
                {attachedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300 max-w-[120px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                  </div>
                ))}

                {/* Sketch / Wireframe chip */}
                {formData.layoutImageBase64 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-sm">
                    <PenTool className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-purple-700 dark:text-purple-300 max-w-[140px] truncate font-medium">Layout Sketch Attached</span>
                    <button
                      type="button"
                      onClick={() => setIsSketchModalOpen(true)}
                      className="text-xs text-purple-600 dark:text-purple-400 underline hover:text-purple-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, layoutImageBase64: null }))}
                      className="p-0.5 hover:bg-purple-100 dark:hover:bg-purple-800 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-purple-500" />
                    </button>
                  </div>
                )}

                {/* Attachment buttons */}
                <>
                    {!hasExistingChat && (
                      <button
                        type="button"
                        onClick={() => setIsSketchModalOpen(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          formData.layoutImageBase64
                            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Draw or upload a wireframe layout sketch"
                      >
                        <PenTool className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {formData.layoutImageBase64 ? "Sketch Attached" : "Sketch Layout"}
                        </span>
                      </button>
                    )}
                    {attachedFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => attachmentInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {"File"}
                          {!hasExistingChat && ` (${attachedFiles.length}/5)`}
                        </span>
                      </button>
                    )}
                </>
              </>

            </div>
          </div>



          <input
            type="file"
            ref={uploadInputRef}
            className="hidden"
            onChange={handleDocumentUpload}
            accept=".pdf,.docx,.txt,.doc"
          />
        </form>

        {/* Translate Modal */}
        <TranslateModal
          isOpen={isTranslateModalOpen}
          onClose={() => setIsTranslateModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitForm}
        />
        <ATSModal
          isOpen={isATSModalOpen}
          onClose={() => setIsATSModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
        />
        <StyleModal
          isOpen={isStyleModalOpen}
          onClose={() => setIsStyleModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
        />
        {/* Justify Modal */}
        <JustifyModal
          isOpen={isJustifyModalOpen}
          onClose={() => setIsJustifyModalOpen(false)}
          setFormData={setFormData}
        />

        {/* Vision-to-Layout Sketch Canvas Modal */}
        <SketchCanvasModal
          isOpen={isSketchModalOpen}
          onClose={() => setIsSketchModalOpen(false)}
          onApplySketch={(imageBase64, promptText) => {
            setFormData(prev => ({
              ...prev,
              layoutImageBase64: imageBase64,
              resumeDescription: promptText || prev.resumeDescription
            }));
          }}
          initialPrompt={formData.resumeDescription}
        />

        {/* User Images Modal */}
        {isUserImagesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {"Your Images"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUserImagesModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoadingUserImages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : userImagesList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {"No images uploaded yet"}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {userImagesList.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setSelectedImageUrl(img.file_url);
                          setIsUserImagesModalOpen(false);
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border-2 focus:outline-none transition-all group relative ${selectedImageUrl === img.file_url
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-transparent hover:border-blue-500'
                          }`}
                        title={img.filename}
                      >
                        <img
                          src={img.file_url}
                          alt={img.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                            {"Select"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteImage(img.slug || img.id.toString(), e)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title={"Delete"}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div >
    </div >
  );
};

export default React.memo(ActivityForm);