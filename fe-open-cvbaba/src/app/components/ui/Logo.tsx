'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { LOGO_TEXT_ARRAY } from '@/app/utils/constants';

interface LogoProps {
  className?: string;
  size?: number;
  text?: string[];
  hoverScale?: number;
  showIcon?: boolean;
  showText?: boolean;
  textClassName?: string;
}

const LogoIcon: React.FC<{
  size: number;
  hoverScale: number;
  isHovered: boolean;
  inline?: boolean;
}> = ({ size, hoverScale, isHovered, inline = false }) => {
  const accentColor = 'currentColor';
  const bgColor = 'transparent';
  const strokeColor = 'currentColor';
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={clsx('relative', inline && 'inline-block')}
      whileHover={shouldReduceMotion ? {} : { scale: hoverScale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-hidden="true"
      style={{
        width: inline ? '1em' : size,
        height: inline ? '1em' : size,
        verticalAlign: inline ? 'middle' : undefined,
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current"
        role="img"
        aria-labelledby={inline ? undefined : 'logoTitle logoDesc'}
      >
        {!inline && (
          <>
            <title id="logoTitle">open-cvbaba Logo</title>
            <desc id="logoDesc">
              An icon of a folded document with an animated letter A
            </desc>
          </>
        )}

        <motion.path
          d="M8 4C6.343 4 5 5.343 5 7V57C5 58.657 6.343 60 8 60H44C45.657 60 47 58.657 47 57V18L34 5H8Z"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{
            pathLength: shouldReduceMotion ? 1 : 0,
            opacity: shouldReduceMotion ? 1 : 0,
          }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeInOut' }}
        />

        <motion.path
          d="M47 18H36C34.895 18 34 17.105 34 16V5L47 18Z"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth="1.5"
          initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 0.8,
          }}
        />

        <motion.g>
          <motion.path
            d="M26 24C26 24 20.5 37 20 40"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: 0.8, ease: "easeInOut" },
                opacity: { duration: 0.3 }
              }
            }}
          />

          <motion.path
            d="M26 24C26 24 31.5 37 32 40"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: 0.8, delay: 0.6, ease: "easeInOut" },
                opacity: { duration: 0.3, delay: 0.6 }
              }
            }}
          />

          {/* Animated dot at the top */}
          <motion.circle
            cx="26"
            cy="24"
            r="1.5"
            fill={accentColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 1.4,
              type: "spring",
              stiffness: 500
            }}
          />

          {/* Enhanced crossbar with spring animation */}
          <motion.path
            d="M23 34H29"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: 1
            }}
            transition={{
              duration: 0.4,
              delay: 1.2,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            style={{ transformOrigin: "center" }}
          />

          {/* Hover effects for the entire A */}
          {isHovered && (
            <motion.rect
              x="19"
              y="23"
              width="14"
              height="18"
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.2 }}
              rx="2"
            />
          )}
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

const LogoText: React.FC<{
  text: string[];
  isHovered: boolean;
  size: number;
  className?: string;
}> = ({ text, isHovered, size, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`flex items-center space-x-1 text-current ${className}`}
      animate={shouldReduceMotion ? {} : { scale: isHovered ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {text.map((letter, index) => {
        if (letter.toUpperCase() === 'A') {
          return (
            <LogoIcon
              key={index}
              size={size * 0.8}
              hoverScale={1}
              isHovered={isHovered}
              inline={true}
            />
          );
        }

        return (
          <motion.span
            key={index}
            className="font-bold"
            animate={
              shouldReduceMotion
                ? {}
                : {
                  y: isHovered ? -2 : 0,
                  scale: isHovered ? 1.1 : 1,
                }
            }
            transition={{
              duration: 0.2,
              delay: index * 0.05,
              type: 'spring',
              stiffness: 500,
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
};

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  text = LOGO_TEXT_ARRAY,
  hoverScale = 1.1,
  showIcon = true,
  showText = true,
  textClassName = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={clsx('flex items-center select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      role="img"
      aria-label="open-cvbaba Logo"
    >
      {showIcon && <LogoIcon size={size} hoverScale={hoverScale} isHovered={isHovered} />}
      {showText && (
        <LogoText
          text={text}
          isHovered={isHovered}
          size={size}
          className={textClassName}
        />
      )}
    </motion.div>
  );
};

export { LOGO_TEXT_ARRAY };
export default Logo;