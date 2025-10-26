'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Tag, Clock, TrendingUp, Zap } from 'lucide-react';
import { Task, PriorityLevel, ImpactLevel } from '@/lib/types';
import { CATEGORY_COLORS, PRIORITY_LEVELS, IMPACT_LEVELS } from '@/lib/constants';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import { useState } from 'react';

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (updatedTask: Task) => void;
}

const priorityVariants = {
  P1: 'danger' as const,
  P2: 'warning' as const,
  P3: 'success' as const,
};

const impactVariants = {
  High: 'danger' as const,
  Medium: 'warning' as const,
  Low: 'info' as const,
};

export default function ViewTaskModal({ task, isOpen, onClose, onUpdateTask }: ViewTaskModalProps) {
  const [localTask, setLocalTask] = useState<Task | null>(task);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!localTask) return null;

  const categoryColors = CATEGORY_COLORS[localTask.category];

  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    const updatedTask = { ...localTask, priorityLevel: newPriority };
    setLocalTask(updatedTask);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/tasks/${localTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priorityLevel: newPriority }),
      });

      if (response.ok && onUpdateTask) {
        onUpdateTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImpactChange = async (newImpact: ImpactLevel) => {
    const updatedTask = { ...localTask, impactLevel: newImpact };
    setLocalTask(updatedTask);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/tasks/${localTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ impactLevel: newImpact }),
      });

      if (response.ok && onUpdateTask) {
        onUpdateTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating impact:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Flex Container for Perfect Centering */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-[#151515] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#262626] max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header with Category Color */}
              <div className={`p-6 border-b border-gray-200 dark:border-[#262626] relative`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${categoryColors.bg}`}></div>
                
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant={priorityVariants[localTask.priorityLevel]} size="sm">
                        {localTask.priorityLevel}
                      </Badge>
                      <Badge variant={impactVariants[localTask.impactLevel]} size="sm">
                        {localTask.impactLevel} Impact
                      </Badge>
                      {localTask.completed && (
                        <Badge variant="success" size="sm">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {localTask.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Tag className="w-4 h-4" />
                      <span className={categoryColors.text}>{localTask.category}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Quick Actions - Priority & Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority Selector */}
                  <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Priority Level</span>
                    </div>
                    <div className="flex gap-2">
                      {PRIORITY_LEVELS.map((priority) => (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(priority)}
                          disabled={isUpdating}
                          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                            localTask.priorityLevel === priority
                              ? priority === 'P1' 
                                ? 'bg-red-500 text-white border-2 border-red-600' 
                                : priority === 'P2'
                                ? 'bg-amber-500 text-white border-2 border-amber-600'
                                : 'bg-blue-500 text-white border-2 border-blue-600'
                              : 'bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#262626] text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Impact Selector */}
                  <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Impact Level</span>
                    </div>
                    <div className="flex gap-2">
                      {IMPACT_LEVELS.map((impact) => (
                        <button
                          key={impact}
                          onClick={() => handleImpactChange(impact)}
                          disabled={isUpdating}
                          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                            localTask.impactLevel === impact
                              ? impact === 'High'
                                ? 'bg-red-500 text-white border-2 border-red-600'
                                : impact === 'Medium'
                                ? 'bg-amber-500 text-white border-2 border-amber-600'
                                : 'bg-green-500 text-white border-2 border-green-600'
                              : 'bg-white dark:bg-[#151515] border border-gray-300 dark:border-[#262626] text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {impact}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Description
                  </h3>
                  {localTask.description ? (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {localTask.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 italic">
                      No description provided
                    </p>
                  )}
                </div>

                {/* Task Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Due Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {format(new Date(localTask.dueDate), 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(localTask.dueDate), 'EEEE')}
                    </p>
                  </div>

                  {/* Created Date */}
                  {task.createdAt && (
                    <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Created</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {format(new Date(localTask.createdAt), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(localTask.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-200 dark:border-[#262626]">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-semibold">Task ID:</span> {localTask.id.slice(0, 8)}...
                    </div>
                    {localTask.updatedAt && (
                      <div>
                        <span className="font-semibold">Last Updated:</span> {format(new Date(localTask.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#0a0a0a] rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

