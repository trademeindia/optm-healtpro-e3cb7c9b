
import React from 'react';

// This file provides fallback components to use when framer-motion is not available
// It helps prevent the app from crashing and provides a graceful fallback

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Motion: React.FC<MotionProps> = ({ 
  children, 
  className = '',
  style = {},
  ...props 
}) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default {
  motion: {
    div: Motion,
    span: Motion,
    button: Motion,
    li: Motion,
    ul: Motion,
    p: Motion,
    a: Motion
  },
  AnimatePresence
};
