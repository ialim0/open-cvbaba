'use client';

import React from 'react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/Footer';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/i18n';

export default function TermsPage() {
    const { t } = useTranslation('legal');
    const lastUpdated = t('legal_pages.common.last_updated', { date: 'December 10, 2025' });

    return (
        <main className="min-h-screen bg-white">
            <Navigation onSignInClick={() => { }} onSignUpClick={() => { }} />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            {t('legal_pages.terms.title')}
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
                            {t('legal_pages.terms.intro')}
                        </p>
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.1.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.1.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                {(t('legal_pages.terms.sections.1.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.2.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.2.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {(t('legal_pages.terms.sections.2.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.3.title')}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.terms.sections.3.text_1')}
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.terms.sections.3.text_2')}
                            </p>
                        </div>


                        {/* Section 4 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.4.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.4.text')}
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.5.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.5.text_1')}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.5.text_2')}
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.6.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.6.text')}
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.7.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.7.text_1')}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.7.text_2')}
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.8.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.8.text_1')}
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.terms.sections.8.text_2')}
                            </p>
                        </div>


                        {/* Section 9 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.9.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.terms.sections.9.text_1')}
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                {t('legal_pages.terms.sections.9.text_2')}
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.terms.sections.10.title')}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.terms.sections.10.text')}
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">@</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-2">{t('legal_pages.common.email_label')}</p>
                                        <a href="mailto:support@open-cvbaba.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                                            support@open-cvbaba.com
                                        </a>
                                    </div>
                                </div>
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
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all"
                            >
                                {t('legal_pages.common.contact_us')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
