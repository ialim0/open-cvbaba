'use client';

import React, { useState, useMemo } from 'react';
import { Check, Search, Sparkles, X } from 'lucide-react';
import { Template } from './data/templates';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return ['All', ...Array.from(cats)];
  }, [templates]);

  // Filter templates based on category and search query
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory =
        selectedCategory === 'All' || template.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.category?.toLowerCase().includes(query) ||
        template.characteristics?.some((c) => c.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  return (
    <div className="space-y-4">
      {/* Category Pills and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Template Notification Banner */}
      {selectedTemplate && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="font-semibold truncate">
              Selected: {selectedTemplate.name}
            </span>
            <span className="text-blue-600/70 dark:text-blue-400/70 hidden sm:inline truncate">
              — {selectedTemplate.category}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectTemplate(selectedTemplate.id)}
            className="ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm flex-shrink-0 transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1 pb-1 scrollbar-thin">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;

            return (
              <div
                key={template.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTemplate(template.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTemplate(template.id);
                  }
                }}
                className={`relative flex flex-col justify-between p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/25 dark:border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
                }`}
              >
                {/* Header: Title, Category & Selection Indicator */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {template.name}
                        </h3>
                        {template.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50">
                            {template.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Radio / Selection Circle */}
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 dark:bg-blue-500 text-white'
                          : 'border-2 border-gray-300 dark:border-gray-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {template.description}
                  </p>
                </div>

                {/* Characteristics / Tags */}
                {template.characteristics && template.characteristics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60">
                    {template.characteristics.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-850 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No templates match your search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(TemplateSelector);