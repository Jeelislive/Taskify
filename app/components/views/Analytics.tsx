'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface AnalyticsProps {
  tasks: Task[];
}

export default function Analytics({ tasks }: AnalyticsProps) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Category breakdown
  const categoryData = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Priority breakdown
  const priorityData = tasks.reduce((acc, task) => {
    acc[task.priorityLevel] = (acc[task.priorityLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Weekly completion trend (mock data for demo)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completionTrend = [3, 5, 2, 8, 6, 4, 7];

  const maxTrend = Math.max(...completionTrend);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-500 mt-1">Insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+12%</span>
          </div>
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completedTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-gray-500 text-sm font-semibold">Active</span>
          </div>
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{pendingTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">+8%</span>
          </div>
          <p className="text-gray-500 text-sm">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate.toFixed(0)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-gray-500 text-sm font-semibold">Total</span>
          </div>
          <p className="text-gray-500 text-sm">All Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Completion Trend</h3>
          <div className="space-y-4">
            {weekDays.map((day, index) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-12">{day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completionTrend[index] / maxTrend) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-3"
                  >
                    <span className="text-white text-sm font-semibold">{completionTrend[index]}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tasks by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([category, count], index) => {
              const colors: Record<string, string> = {
                Work: 'bg-blue-500',
                Personal: 'bg-purple-500',
                Health: 'bg-green-500',
                Errands: 'bg-amber-500',
              };
              const percentage = (count / totalTasks) * 100;
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`${colors[category] || 'bg-gray-500'} h-full rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Priority Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(priorityData).map(([priority, count], index) => {
              const colors: Record<string, string> = {
                P1: 'bg-red-500',
                P2: 'bg-amber-500',
                P3: 'bg-blue-500',
              };
              const percentage = (count / totalTasks) * 100;
              
              return (
                <div key={priority} className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${colors[priority]} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold">{priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Priority {priority}</span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        className={`${colors[priority]} h-full rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Productivity Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <h3 className="text-lg font-bold mb-2">Productivity Score</h3>
          <p className="text-indigo-100 text-sm mb-6">Based on completion rate and consistency</p>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 352 }}
                  animate={{ strokeDashoffset: 352 - (352 * completionRate) / 100 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  strokeDasharray="352"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{completionRate.toFixed(0)}</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-indigo-100">Excellent Performance! 🎉</p>
        </motion.div>
      </div>
    </div>
  );
}


