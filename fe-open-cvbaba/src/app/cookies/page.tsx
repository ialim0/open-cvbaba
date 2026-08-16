'use client';

import React from 'react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/Footer';
import { Settings, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/i18n';
import { Trans } from 'react-i18next';

export default function CookiesPage() {
    const { t } = useTranslation('legal');
    const lastUpdated = t('legal_pages.common.last_updated', { date: 'December 10, 2025' });

    const summaryIcons = [
        <CheckCircle2 key="0" className="w-8 h-8 text-gray-900 mb-4" />,
        <Settings key="1" className="w-8 h-8 text-gray-900 mb-4" />,
        <Shield key="2" className="w-8 h-8 text-gray-900 mb-4" />
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navigation onSignInClick={() => { }} onSignUpClick={() => { }} />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            {t('legal_pages.cookies.title')}
                        </h1>
                        <p className="text-xl text-gray-600">
                            {lastUpdated}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Introduction */}
                    <div className="prose prose-lg max-w-none mb-16">
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {t('legal_pages.cookies.intro')}
                        </p>
                    </div>

                    {/* Quick Summary Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {(t('legal_pages.cookies.summary', { returnObjects: true }) as any[]).map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6">
                                {summaryIcons[index]}
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.1.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.cookies.sections.1.text_1')}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.cookies.sections.1.text_2')}
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.2.title')}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.cookies.sections.2.text')}
                            </p>

                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                                {(t('legal_pages.cookies.sections.2.types', { returnObjects: true }) as any[]).map((type, index) => (
                                    <div key={index} className={`p-6 ${index !== 2 ? 'border-b border-gray-100' : ''} ${index === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                                        <p className="text-gray-600 text-sm">{type.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.3.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.cookies.sections.3.text_1')}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.cookies.sections.3.text_2')}
                            </p>
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
                                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-2">{t('legal_pages.cookies.sections.3.browser_controls.title')}</h4>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        <Trans
                                            i18nKey="legal_pages.cookies.sections.3.browser_controls.text"
                                            components={{
                                                1: <a href="https://www.aboutcookies.org" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer" />,
                                                2: <a href="https://www.allaboutcookies.org" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer" />
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.4.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.cookies.sections.4.text')}
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.5.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.cookies.sections.5.text_1')}
                            </p>
                            <p className="text-gray-600 mt-4 leading-relaxed">
                                {t('legal_pages.cookies.sections.5.text_2')}
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.cookies.sections.6.title')}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.cookies.sections.6.text')}
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <Link href="/contact" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                                    {t('legal_pages.common.contact_support')}
                                </Link>
                                <p className="text-gray-600 mt-2">
                                    {t('legal_pages.common.or_email_at')} <a href="mailto:support@open-cvbaba.com" className="text-blue-600 hover:underline">support@open-cvbaba.com</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related Links */}
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">{t('legal_pages.common.related_documents')}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/privacy"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
                            >
                                {t('legal_pages.privacy.title')}
                            </Link>
                            <Link
                                href="/terms"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all"
                            >
                                {t('legal_pages.terms.title')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
