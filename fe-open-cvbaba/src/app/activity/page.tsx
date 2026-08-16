"use client";
import React, { useState, useCallback, useMemo, Suspense } from "react";
import ActivityChat from "../components/ActivityChat/ActivityChat";
import { OpenCvbabaLogo } from "../components/ui/OpenCvbabaLogo";

// Skeleton loader component for better perceived performance
const ActivityChatSkeleton = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        <OpenCvbabaLogo className="w-14 h-14 animate-pulse" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
      </div>
      <div className="text-center space-y-2">
        <div className="text-gray-900 dark:text-gray-100 font-medium text-lg">Loading your workspace...</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">Preparing AI-powered document tools</div>
      </div>
      {/* Skeleton cards */}
      <div className="flex gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

const ActivityPage: React.FC = () => {
  const [includePhoto, setIncludePhoto] = useState<boolean>(false);

  const handlePdfGenerated = useCallback((pdfUrl: string) => {
    console.log("PDF Generated:", pdfUrl);
  }, []);

  const mainContent = useMemo(
    () => (

      <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen">
        <Suspense fallback={<ActivityChatSkeleton />}>
          <div className="flex-grow overflow-y-auto">
            <ActivityChat
              includePhoto={includePhoto}
              setIncludePhoto={setIncludePhoto}
              onPdfGenerated={handlePdfGenerated}
            />
          </div>
        </Suspense>
      </div>
    ),
    [includePhoto, handlePdfGenerated]
  );

  return mainContent;
};

export default ActivityPage;