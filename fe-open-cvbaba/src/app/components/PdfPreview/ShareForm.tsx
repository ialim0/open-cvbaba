import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/app/i18n/i18n";

interface ShareFormProps {
    onInvite: (email: string) => Promise<void>;
    isLoading: boolean;
}

export const ShareForm: React.FC<ShareFormProps> = ({ onInvite, isLoading }) => {
    const { t } = useTranslation('activity');
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isLoading) return;

        await onInvite(email);
        setEmail("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                type="email"
                placeholder={t('pdfPreview.invitePlaceholder', { defaultValue: 'name@example.com' })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors"
                required
                disabled={isLoading}
            />
            <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white h-11 px-6 min-w-[90px] font-medium transition-all shadow-sm"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    t('pdfPreview.invite', { defaultValue: 'Invite' })
                )}
            </Button>
        </form>
    );
};
