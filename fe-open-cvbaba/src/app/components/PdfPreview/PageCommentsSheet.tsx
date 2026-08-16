import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/i18n';
import { PageSheet } from './PageSheet';
import { Button } from '../ui/Button';
import TextArea from '../ui/Textarea';
import { MessageSquare, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Comment {
    id: number;
    user_name: string;
    content: string;
    created_at: string;
    updated_at?: string;
    is_own_comment: boolean;
    page_number?: number;
}

interface PageCommentsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    pageNumber: number;
    comments: Comment[];
    onAddComment: (content: string, pageNumber: number) => Promise<void>;
    onEditComment: (commentId: number, content: string) => Promise<void>;
    onDeleteComment: (commentId: number) => Promise<void>;
    isLoading?: boolean;
}

export const PageCommentsSheet: React.FC<PageCommentsSheetProps> = ({
    isOpen,
    onClose,
    pageNumber,
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
    isLoading = false,
}) => {
    const { t } = useTranslation('activity');
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter comments for the current page
    const pageComments = comments.filter(c => c.page_number === pageNumber);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment, pageNumber);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleSaveEdit = async (commentId: number) => {
        if (!editContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onEditComment(commentId, editContent);
            setEditingCommentId(null);
            setEditContent('');
        } catch (error) {
            console.error('Error editing comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm(t('pdfPreview.comments.confirmDelete', { defaultValue: 'Are you sure you want to delete this comment?' }))) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onDeleteComment(commentId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t('pdfPreview.comments.justNow', { defaultValue: 'Just now' });
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

        return date.toLocaleDateString();
    };

    return (
        <PageSheet
            isOpen={isOpen}
            onClose={onClose}
            title={t('pdfPreview.comments.pageTitle', { page: pageNumber, defaultValue: `Page ${pageNumber} Comments` })}
            icon={<MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            footer={
                <div className="relative">
                    <TextArea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('pdfPreview.comments.placeholder', { defaultValue: 'Write a comment...' })}
                        className="min-h-[70px] pb-10 text-sm resize-none border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                        disabled={isSubmitting}
                    />
                    <div className="absolute bottom-2 right-2">
                        <Button
                            onClick={handleAddComment}
                            disabled={isSubmitting || !newComment.trim()}
                            size="sm"
                            className="h-7 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-3 w-3" />
                            ) : (
                                <span className="text-xs font-medium">{t('common.post', { defaultValue: 'Post' })}</span>
                            )}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/50 -m-4 p-4 min-h-[200px]">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
                    </div>
                ) : pageComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                            <MessageSquare className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {t('pdfPreview.comments.noPageCommentsTitle', { defaultValue: 'No comments yet' })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
                            {t('pdfPreview.comments.noPageCommentsDesc', { defaultValue: 'Start the conversation by adding a comment.' })}
                        </p>
                    </div>
                ) : (
                    pageComments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`group relative p-3 rounded-xl border transition-all ${comment.is_own_comment
                                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800'
                                }`}
                        >
                            {/* Comment Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${comment.is_own_comment
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {comment.user_name ? comment.user_name.substring(0, 2).toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            {comment.user_name}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {formatDate(comment.updated_at || comment.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {comment.is_own_comment && !editingCommentId && (
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(comment)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Comment Content */}
                            {editingCommentId === comment.id ? (
                                <div className="space-y-2 mt-2">
                                    <TextArea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="min-h-[60px] text-sm resize-none p-2"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCancelEdit}
                                            disabled={isSubmitting}
                                            className="h-7 text-xs"
                                        >
                                            {t('common.cancel', { defaultValue: 'Cancel' })}
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveEdit(comment.id)}
                                            disabled={isSubmitting || !editContent.trim()}
                                            className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            {t('common.save', { defaultValue: 'Save' })}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pl-8">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </PageSheet>
    );
};
