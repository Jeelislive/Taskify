'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';

interface CategoryChartProps {
  tasks: Task[];
}

const categoryColors = {
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Health: '#10b981',
  Errands: '#f59e0b',
};

export default function CategoryChart({ tasks }: CategoryChartProps) {
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = tasks.length || 1;
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-100 mb-4">Tasks by Category</h3>
      {Object.entries(categoryColors).map(([category, color], index) => {
        const count = categoryCounts[category] || 0;
        const percentage = (count / total) * 100;
        const heightPercentage = (count / maxCount) * 100;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-300 font-medium">{category}</span>
              </div>
              <span className="text-gray-400 font-bold">
                {count} ({Math.round(percentage)}%)
              </span>
            </div>
            
            <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


