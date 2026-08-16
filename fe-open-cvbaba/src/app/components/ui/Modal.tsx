import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  titleClassName?: string;
  headerClassName?: string;
  closeButtonClassName?: string;
  ariaLabelledBy?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  titleClassName,
  headerClassName,
  closeButtonClassName,
  ariaLabelledBy,
  className,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg lg:max-w-xl',
    lg: 'sm:max-w-2xl lg:max-w-3xl',
    xl: 'sm:max-w-4xl lg:max-w-5xl',
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      let root = document.getElementById('modal-root');
      if (!root) {
        root = document.createElement('div');
        root.setAttribute('id', 'modal-root');
        document.body.appendChild(root);
      }
      setModalRoot(root);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);

        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <FocusLock>
        <div
          className={`relative z-50 w-full ${sizeClasses[size]} mx-auto ${className || ''}`}
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-all duration-300 transform">
            {/* Header Section */}
            {title && (
              <div
                className={
                  headerClassName ||
                  'px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 rounded-t-2xl bg-white dark:bg-gray-900'
                }
              >
                <div className="flex items-center justify-between">
                  <h2
                    id={ariaLabelledBy}
                    className={
                      titleClassName ||
                      'text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'
                    }
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className={
                      closeButtonClassName ||
                      'p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 rounded-lg transition-all duration-200'
                    }
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
              <div className="h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </FocusLock>
    </div>,
    modalRoot
  );
};

export default Modal;