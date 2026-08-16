import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Edit, Trash2, Check, X, FileText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from '@radix-ui/react-tooltip';
import axios from 'axios';
import { Button } from '../../ui/Button';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { Input } from '../../ui/Input';
import { toast } from 'react-toastify';
import { cn } from '../../lib/utils';
import { useTranslation } from '@/app/i18n/i18n';

// Format date in a smart, relative way
const formatSmartDate = (dateString: string, yesterdayText: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (isYesterday(date)) {
    return yesterdayText;
  } else if (diffInHours < 168) { // Less than 7 days
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, 'MMM d');
  }
};

const MAX_TITLE_LENGTH = 28;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ChatHistoryItemProps {
  slug: string;
  title: string;
  date: string;
  onEdit: (slug: string, newTitle: string) => void;
  onDelete: (slug: string) => void;
  onClick: () => void;
  isShared?: boolean;
  ownerEmail?: string;

}

interface EditModeProps {
  editTitle: string;
  setEditTitle: (title: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  inputId: string;
}

interface ActionButtonsProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isDeleteMode: boolean;
}

const EditMode: React.FC<EditModeProps> = ({
  editTitle,
  setEditTitle,
  onConfirm,
  onCancel,
  inputId,
}) => {
  const { t } = useTranslation('settings');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onConfirm();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
      <Input
        id={inputId}
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent focus:ring-1 focus:ring-gray-500 rounded-md"
        aria-label={t('chatHistory.editTitleAriaLabel')}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onConfirm}
          className="text-gray-900 hover:bg-gray-100"
          aria-label={t('chatHistory.saveButtonAriaLabel')}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-600 hover:bg-gray-100"
          aria-label={t('chatHistory.cancelButtonAriaLabel')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEditClick,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
  isDeleteMode,
}) => {
  const { t } = useTranslation('settings');

  return (
    <div className="flex items-center gap-1">
      {!isDeleteMode && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditClick}
          className="h-8 w-8 rounded-full text-gray-500 hover:text-black hover:bg-gray-100"
          aria-label={t('chatHistory.editButtonAriaLabel')}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {isDeleteMode ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onConfirmDelete}
            className="h-8 w-8 rounded-full text-red-600 hover:bg-red-100"
            aria-label={t('chatHistory.confirmDeleteButtonAriaLabel')}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelDelete}
            className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
            aria-label={t('chatHistory.cancelDeleteButtonAriaLabel')}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteClick}
          className="h-8 w-8 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-100"
          aria-label={t('chatHistory.deleteButtonAriaLabel')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const DocumentIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className={cn(
    'flex items-center justify-center p-1.5 rounded-md transition-all duration-200',
    isActive
      ? 'bg-blue-100 dark:bg-blue-500/20'
      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
  )}>
    <FileText className={cn(
      'h-3.5 w-3.5 transition-colors',
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400'
    )} />
  </div>
);

const ChatHistoryItemComponent: React.FC<ChatHistoryItemProps> = ({
  slug,
  title,
  date,
  onEdit,
  onDelete,
  onClick,
  isShared = false,
  ownerEmail,

}) => {
  const { t } = useTranslation('settings');
  const router = useRouter();
  const pathname = usePathname();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const uniqueEditInputId = useRef(`edit-input-${slug}`).current;

  const isActive = pathname === `/activity/${slug}`;
  const truncatedTitle =
    title.length > MAX_TITLE_LENGTH
      ? `${title.substring(0, MAX_TITLE_LENGTH)}...`
      : title;
  const formattedDate = formatSmartDate(date, t('chatHistory.yesterday'));



  const handleEditConfirm = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle || trimmedTitle === title) {
      setIsEditMode(false);
      setEditTitle(title);
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/api/chat/${slug}`,
        { title: trimmedTitle },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          withCredentials: true,
        }
      );
      onEdit(slug, trimmedTitle);
      setIsEditMode(false);
      toast.success(t('chatHistory.editSuccessMessage'));
    } catch (error) {
      console.error('Error updating chat title:', error);
      toast.error(t('chatHistory.editErrorMessage'));
      setEditTitle(title);
      setIsEditMode(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/chat/${slug}`, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      });
      onDelete(slug);
      setIsDeleteMode(false);
      toast.success(t('chatHistory.deleteSuccessMessage'));
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error(t('chatHistory.deleteErrorMessage'));
      setIsDeleteMode(false);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-all duration-200 border',
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
          : 'bg-white dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
      role="listitem"
      aria-labelledby={`chat-title-${slug}`}
      onClick={() => !isEditMode && onClick()}
    >
      <TooltipProvider delayDuration={200}>
        {isEditMode ? (
          <EditMode
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            onConfirm={handleEditConfirm}
            onCancel={() => {
              setIsEditMode(false);
              setEditTitle(title);
            }}
            inputId={uniqueEditInputId}
          />
        ) : (
          <>
            <div className="flex items-center min-w-0 flex-1 space-x-3">
              <DocumentIndicator isActive={isActive} />
              <div className="flex flex-col min-w-0 flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      id={`chat-title-${slug}`}
                      className={cn(
                        'text-sm truncate font-medium transition-colors',
                        isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                      )}
                    >
                      {truncatedTitle}
                    </span>
                  </TooltipTrigger>

                  {title.length > MAX_TITLE_LENGTH && (
                    <TooltipPortal>
                      <TooltipContent
                        side="top"
                        align="start"
                        sideOffset={4}
                        className="z-50 max-w-[200px] bg-blue-600 text-white p-2 rounded-md shadow-lg text-xs break-words border border-blue-500 animate-in fade-in zoom-in duration-200"
                      >
                        <p>{title}</p>
                      </TooltipContent>
                    </TooltipPortal>
                  )}
                </Tooltip>
                <div className="flex flex-col">
                  <span
                    className={cn('text-xs text-gray-500 dark:text-gray-400')}
                  >
                    {formattedDate}
                  </span>
                  {isShared && ownerEmail && (
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                      {t('chatHistory.sharedFrom')} {ownerEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isShared && (
              <div
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ActionButtons
                  onEditClick={() => {
                    setIsEditMode(true);
                    setEditTitle(title);
                  }}
                  onDeleteClick={() => setIsDeleteMode(true)}
                  onConfirmDelete={handleDeleteConfirm}
                  onCancelDelete={() => setIsDeleteMode(false)}
                  isDeleteMode={isDeleteMode}
                />
              </div>
            )}
          </>
        )}
      </TooltipProvider>
    </div>
  );
};

const ChatHistoryItem = React.memo(ChatHistoryItemComponent);
ChatHistoryItem.displayName = 'ChatHistoryItem';
export default ChatHistoryItem;
