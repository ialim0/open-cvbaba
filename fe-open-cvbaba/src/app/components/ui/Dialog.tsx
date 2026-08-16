import React, { useState, useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

// Dialog Context
const DialogContext = createContext<{
  handleClose: () => void;
} | null>(null);

interface DialogProps {
  children: ReactNode;
  trigger?: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  trigger,
  className = '',
  open: controlledOpen,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(controlledOpen ?? false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const dialogContent = isOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className={cn(
          'bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-out',
          'max-h-[calc(100vh-2rem)] w-full sm:w-[500px] flex flex-col',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
      >
        <DialogContext.Provider value={{ handleClose }}>
          {children}
        </DialogContext.Provider>
      </div>
    </div>
  );

  return (
    <>
      {trigger && (
        <div onClick={handleOpen} role="button" tabIndex={0}>
          {trigger}
        </div>
      )}
      {typeof window !== 'undefined' && createPortal(dialogContent, document.body)}
    </>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  return asChild ? <>{children}</> : <div>{children}</div>;
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => (
  <div className={cn('flex flex-col h-full', className)}>{children}</div>
);

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = '' }) => {
  const context = useContext(DialogContext);
  const handleClose = context?.handleClose;

  return (
    <div className={cn('flex items-center justify-between p-4 border-b', className)}>
      <div className="flex-1" />
      {children}
      <div className="flex-1 flex justify-end">
        <DialogCloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => (
  <h2 className={cn('text-xl font-semibold text-gray-900 text-center', className)}>
    {children}
  </h2>
);

export const DialogCloseButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-blue-600 hover:text-gray-500  "
    aria-label="Close dialog"
  >
    <X size={24} />
  </button>
);

export const DialogBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={cn('flex-1 overflow-y-auto p-4', className)}>
    {children}
  </div>
);

export default Dialog;
