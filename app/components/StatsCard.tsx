'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-950/40',
    border: 'border-blue-900',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-950',
  },
  purple: {
    bg: 'bg-purple-950/40',
    border: 'border-purple-900',
    icon: 'text-purple-400',
    iconBg: 'bg-purple-950',
  },
  green: {
    bg: 'bg-green-950/40',
    border: 'border-green-900',
    icon: 'text-green-400',
    iconBg: 'bg-green-950',
  },
  orange: {
    bg: 'bg-orange-950/40',
    border: 'border-orange-900',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-950',
  },
  pink: {
    bg: 'bg-pink-950/40',
    border: 'border-pink-900',
    icon: 'text-pink-400',
    iconBg: 'bg-pink-950',
  },
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend,
  delay = 0 
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={`
        ${colors.bg}
        rounded-xl p-5
        border ${colors.border}
        hover:border-gray-700 transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${colors.iconBg} border ${colors.border}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
            ${trend.isPositive ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}
          `}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <h3 className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">
        {title}
      </h3>

      <p className="text-3xl font-bold text-gray-100">
        {value}
      </p>
    </motion.div>
  );
}

