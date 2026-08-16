import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../ui/Modal";
import { useTranslation } from "@/app/i18n/i18n";
import { MessageSquare, Sparkles, Bug, CheckCircle2, Loader2, Send } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('settings');
  const [formState, setFormState] = useState({
    subject: "feedback",
    message: "",
  });
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const SUBJECTS = [
    {
      value: "feedback",
      label: t('feedbackModal.subjects.feedback.label'),
      description: t('feedbackModal.subjects.feedback.description'),
      icon: MessageSquare
    },
    {
      value: "general",
      label: t('feedbackModal.subjects.general.label'),
      description: t('feedbackModal.subjects.general.description'),
      icon: Sparkles
    },
    {
      value: "other",
      label: t('feedbackModal.subjects.other.label'),
      description: t('feedbackModal.subjects.other.description'),
      icon: Bug
    },
  ];

  useEffect(() => {
    if (isOpen) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
            headers: { Accept: "application/json" },
            withCredentials: true,
          });
          const { full_name, email } = response.data;
          setUserProfile({ name: full_name, email });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    const { subject, message } = formState;

    if (!message.trim()) {
      setFormError(t('feedbackModal.errors.messageRequired'));
      setIsLoading(false);
      return;
    }

    const formDataToSend = new URLSearchParams();
    formDataToSend.append("name", userProfile?.name || "");
    formDataToSend.append("email", userProfile?.email || "");
    formDataToSend.append("subject", subject);
    formDataToSend.append("message", message);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CONTACT as string, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.text();
      const jsonResult = JSON.parse(result);

      if (jsonResult.result === "success") {
        setIsSubmitted(true);
        setFormState({ subject: "feedback", message: "" });
      } else {
        setFormError(t('feedbackModal.errors.submissionError', { error: jsonResult.message || t('feedbackModal.errors.unknownError') }));
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError(t('feedbackModal.errors.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, message: e.target.value }));
  };

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('feedbackModal.thankYouHeading')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto mb-8">
            {t('feedbackModal.thankYouMessage')}
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-all shadow-sm hover:translate-y-[-1px]"
          >
            {t('feedbackModal.closeButton')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('feedbackModal.title')}>
      <div className="w-full max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide opacity-80">
              {t('feedbackModal.subjectLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUBJECTS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSubjectChange(value)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                    ${formState.subject === value
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 mb-2 ${formState.subject === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}`} />
                  <span className="font-semibold text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleMessageChange}
              className="block w-full p-4 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none min-h-[160px] placeholder-gray-400 dark:placeholder-gray-500"
              placeholder={`${SUBJECTS.find(s => s.value === formState.subject)?.description || t('feedbackModal.messagePlaceholder')}...`}
              required
            />
          </div>

          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-center sm:text-left text-gray-500 dark:text-gray-400">
              {t('feedbackModal.responseTime')}
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('feedbackModal.submittingButton')}</span>
                </>
              ) : (
                <>
                  <span>{t('feedbackModal.submitButton')}</span>
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;