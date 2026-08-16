import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import Modal from '../../ui/Modal';
import { useTranslation } from '@/app/i18n/i18n';
import { Button } from '../../ui/Button';
import { ScrollArea } from '../../ui/ScrollArea';

interface Notification {
  id: number;
  title: string;
  description: string;
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  const { t } = useTranslation('settings');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('notifications.title')}
      ariaLabelledBy="notifications-modal-title"
      className="w-full sm:max-w-md mx-auto"
    >
      <div className="flex flex-col h-full max-h-[70vh]">
        {/* Header with unread count and mark-all-read button */}
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <span className="text-sm text-gray-500">
            {notifications.filter((n) => !n.read).length}{' '}
            {t('notifications.unread')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => notifications.forEach((n) => onMarkAsRead(n.id))}
            disabled={!notifications.some((n) => !n.read)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('notifications.markAsRead')}
          </Button>
        </div>

        {/* Notifications list */}
        <ScrollArea className="flex-1 p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-gray-500">{t('notifications.empty')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  mb-3 p-4 rounded-lg border
                  ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}
                  ${notification.read ? 'border-gray-200' : 'border-blue-500'}
                  hover:bg-blue-100 transition-colors duration-200
                `}
                onClick={() => !notification.read && onMarkAsRead(notification.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {notification.description}
                </p>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default NotificationsModal;