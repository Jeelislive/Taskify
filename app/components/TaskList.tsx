'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { CATEGORY_COLORS, IMPACT_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks extracted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[task.category].bg} ${CATEGORY_COLORS[task.category].text} ${CATEGORY_COLORS[task.category].border} border`}>
                    {task.category}
                  </span>
                  <span className={`text-xs font-bold ${PRIORITY_COLORS[task.priorityLevel]}`}>
                    {task.priorityLevel}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <AlertCircle className={`w-4 h-4 ${IMPACT_COLORS[task.impactLevel]}`} />
                    <span className={`font-medium ${IMPACT_COLORS[task.impactLevel]}`}>
                      {task.impactLevel} Impact
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {onEdit && (
                  <motion.button
                    onClick={() => onEdit(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                )}
                {onDelete && (
                  <motion.button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

