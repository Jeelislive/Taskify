'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';

interface RightPanelProps {
  tasks: Task[];
}

export default function RightPanel({ tasks }: RightPanelProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = tasks.filter(t => !t.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="w-80 h-screen bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-[#1a1a1a] fixed right-0 top-0 flex flex-col overflow-y-auto pt-20">

      {/* Task Activity */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Task Activity</h3>
          <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
            See More
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="space-y-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-100 dark:bg-gradient-to-r dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-gray-200 dark:border-indigo-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-indigo-400 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completionRate.toFixed(0)}%</p>
              </div>
              <div className="w-16 h-16 bg-gray-200 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-700 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 border border-gray-200 dark:border-[#1a1a1a]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalTasks}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">{completedTasks}</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
            <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{inProgressTasks}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">To-Do</span>
            <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{inProgressTasks}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
            <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{completedTasks}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

