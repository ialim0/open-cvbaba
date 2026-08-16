// src/components/Slider.tsx

"use client";

import React, { useRef, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min, max, step, label }) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    let newValue = value;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      newValue = Math.max(value - step, min);
      onChange(newValue);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      newValue = Math.min(value + step, max);
      onChange(newValue);
      e.preventDefault();
    }
  };

  // Calculate the percentage for the gradient
  const percentage = ((value - min) / (max - min)) * 100;

  // Generate the gradient background
  const sliderStyle = {
    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
  };

  // Calculate tooltip position to prevent overflow
  const tooltipPosition = () => {
    if (percentage < 10) return { left: '0%' };
    if (percentage > 90) return { left: '90%' };
    return { left: `${percentage - 5}%` }; // Adjust -5% to center the tooltip
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={sliderRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); setIsDragging(false); }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          style={sliderStyle}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        />
        {/* Current Value Tooltip */}
        {(isFocused || isDragging) && (
          <div
            className={`absolute top-0 transform -translate-y-8`}
            style={tooltipPosition()}
          >
            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md">
              {value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
