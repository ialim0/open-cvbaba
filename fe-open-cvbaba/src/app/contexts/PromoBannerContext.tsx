"use client";

import React, { createContext, useContext, useState } from "react";

interface PromoBannerContextType {
  isPromoBannerVisible: boolean;
  setIsPromoBannerVisible: (visible: boolean) => void;
}

const PromoBannerContext = createContext<PromoBannerContextType>({
  isPromoBannerVisible: false,
  setIsPromoBannerVisible: () => {},
});

export const usePromoBanner = () => useContext(PromoBannerContext);

export const PromoBannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPromoBannerVisible, setIsPromoBannerVisible] = useState(false);

  return (
    <PromoBannerContext.Provider value={{ isPromoBannerVisible, setIsPromoBannerVisible }}>
      {children}
    </PromoBannerContext.Provider>
  );
};