'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MinimalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export default function MinimalButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
}: MinimalButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-900 hover:bg-gray-800 text-gray-300 border-gray-800 hover:border-gray-700',
    ghost: 'bg-transparent hover:bg-gray-900 text-gray-400 hover:text-gray-300 border-transparent hover:border-gray-800',
    danger: 'bg-red-950/50 hover:bg-red-950 text-red-200 border-red-900 hover:border-red-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </motion.button>
  );
}


