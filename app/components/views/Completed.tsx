'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Tag, Trash2, Clock } from 'lucide-react';
import { Task } from '@/lib/types';
import { format } from 'date-fns';

interface CompletedProps {
  tasks: Task[];
  onDelete?: (taskId: string) => void;
}

const categoryColors: Record<string, string> = {
  Work: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Personal: 'bg-purple-100 text-purple-700 border-purple-200',
  Health: 'bg-green-100 text-green-700 border-green-200',
  Errands: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function Completed({ tasks, onDelete }: CompletedProps) {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-gray-500 mt-1">
            {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      </div>

      {/* Completed Tasks Log */}
      {completedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No completed tasks yet</h3>
          <p className="text-gray-500">Complete tasks to see them here</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {completedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Checkmark Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-gray-900 line-through">
                      {task.title}
                    </h3>
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this completed task?')) {
                            onDelete(task.id);
                          }
                        }}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Task Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {/* Category */}
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[task.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {task.category}
                      </span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        task.priorityLevel === 'P1' 
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : task.priorityLevel === 'P2'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {task.priorityLevel}
                      </span>
                    </div>

                    {/* Completed Time */}
                    {task.updatedAt && (
                      <div className="flex items-center gap-1.5 text-gray-400 ml-auto">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">
                          Completed {format(new Date(task.updatedAt), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

