// src/app/test-ux/page.tsx
'use client';

import React, { useState } from 'react';
import ActivityForm from '../components/ActivityChat/ActivityForm';

const TestUXPage = () => {
  const [formData, setFormData] = useState({
    resumeDescription: '',
    selectedTemplateId: '',
    language: 'en-US',
  });
  const [includePhoto, setIncludePhoto] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <ActivityForm
      formData={formData}
      setFormData={setFormData}
      onInputChange={() => {}}
      includePhoto={includePhoto}
      setIncludePhoto={setIncludePhoto}
      onSubmit={() => {}}
      isLoading={false}
      showTemplateSelector={true}
      userProfile={userProfile}
      setUserProfile={setUserProfile}
      hasExistingChat={false}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      onRefreshCredits={() => {}}
      creditsAvailable={10}
      subscription={null}
    />
  );
};

export default TestUXPage;
