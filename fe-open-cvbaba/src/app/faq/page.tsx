'use client';

import React, { useState } from 'react';
import Navigation from '@/app/components/Navigation';
import SiteFooter from '@/app/components/Footer';
import { useTranslation } from '@/app/i18n/i18n';
import { ChevronDown, ChevronUp, Search, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const { t } = useTranslation('legal');
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // key is the internal category name (pricing, getting_started, etc.)
    // We will use this to look up the display name
    const faqItems = (t('faq_page.items', { returnObjects: true }) as FAQItem[]) || [];

    // unique categories from the items
    const uniqueCategories = Array.from(new Set(faqItems.map(item => item.category)));
    const categories = ['all', ...uniqueCategories];

    const getCategoryLabel = (cat: string) => {
        return t(`faq_page.categories.${cat}`);
    };

    const filteredFAQs = faqItems.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navigation onSignInClick={() => { }} onSignUpClick={() => { }} />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            {t('faq_page.title')}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            {t('faq_page.subtitle')}
                            <Link href="/contact" className="text-gray-900 font-semibold hover:underline ml-1">
                                {t('faq_page.contact_link_text')}
                            </Link>
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('faq_page.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {getCategoryLabel(category)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">{t('faq_page.no_results')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFAQs.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 pr-4">
                                            <div className="text-xs font-semibold text-gray-500 mb-1">
                                                {getCategoryLabel(item.category)}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.question}
                                            </h3>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {openIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-5 pt-2">
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('faq_page.cta.title')}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        {t('faq_page.cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>{t('faq_page.cta.contact_support')}</span>
                        </Link>
                        <a
                            href="mailto:support@open-cvbaba.com"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all"
                        >
                            <Mail className="w-5 h-5" />
                            <span>{t('faq_page.cta.email_us')}</span>
                        </a>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
