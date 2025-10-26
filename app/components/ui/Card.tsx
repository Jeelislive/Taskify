'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  gradient = false 
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50
        ${gradient ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' : ''}
        ${hover ? 'hover:shadow-xl hover:shadow-purple-500/10 hover:border-gray-600 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}


