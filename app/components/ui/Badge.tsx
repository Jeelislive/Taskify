'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  success: 'bg-green-500/20 text-green-300 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  info: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  secondary: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center justify-center
        font-bold rounded-lg backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
}


