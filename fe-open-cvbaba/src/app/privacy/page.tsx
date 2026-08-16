'use client';

import React from 'react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/Footer';
import { Lock, Eye, UserX, Mail } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/i18n';

export default function PrivacyPage() {
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
                            {t('legal_pages.privacy.title')}
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
                            {t('legal_pages.privacy.intro')}
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <Lock className="w-8 h-8 text-gray-900 mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">{t('legal_pages.privacy.key_points.0.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('legal_pages.privacy.key_points.0.description')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <Eye className="w-8 h-8 text-gray-900 mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">{t('legal_pages.privacy.key_points.1.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('legal_pages.privacy.key_points.1.description')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <UserX className="w-8 h-8 text-gray-900 mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">{t('legal_pages.privacy.key_points.2.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('legal_pages.privacy.key_points.2.description')}</p>
                        </div>
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.1.title')}</h2>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.1.personal_info.title')}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.1.personal_info.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                                {(t('legal_pages.privacy.sections.1.personal_info.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.1.document_content.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.1.document_content.text')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.1.usage_info.title')}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.1.usage_info.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {(t('legal_pages.privacy.sections.1.usage_info.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.2.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.2.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {(t('legal_pages.privacy.sections.2.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.3.title')}</h2>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.3.no_sell.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.3.no_sell.text')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.3.service_providers.title')}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.3.service_providers.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                                {(t('legal_pages.privacy.sections.3.service_providers.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.3.service_providers.text_2')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.3.legal.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.3.legal.text')}
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.4.title')}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.4.text')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {(t('legal_pages.privacy.sections.4.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <p className="text-gray-600 mt-4 leading-relaxed">
                                {t('legal_pages.privacy.sections.4.text_2')}
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.5.title')}</h2>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.5.access.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.5.access.text')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.5.deletion.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.5.deletion.text')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.5.marketing.title')}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.5.marketing.text')}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_pages.privacy.sections.5.cookies.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.5.cookies.text')}
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.6.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.6.text')}
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.7.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.7.text')}
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.8.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.8.text')}
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.9.title')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('legal_pages.privacy.sections.9.text')}
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legal_pages.privacy.sections.10.title')}</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t('legal_pages.privacy.sections.10.text')}
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
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
                                href="/terms"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
                            >
                                {t('legal_pages.common.terms_of_service')}
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
