'use client';

import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Trash2, Check, X } from 'lucide-react';
import { Task } from '@/lib/types';
import { CATEGORY_COLORS, IMPACT_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        bg-white rounded-lg shadow-md border-2 p-4 cursor-grab active:cursor-grabbing
        hover:shadow-xl transition-all duration-200
        ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''}
        ${task.completed ? 'opacity-60 bg-gray-50' : ''}
        ${CATEGORY_COLORS[task.category].border}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded ${PRIORITY_COLORS[task.priorityLevel]} bg-opacity-20`}>
              {task.priorityLevel}
            </span>
          </div>

          <h4 className={`text-base font-bold text-gray-900 mb-1 ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h4>

          {task.description && (
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {onToggleComplete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id, !task.completed);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                task.completed
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
        </div>

        <div className="flex items-center gap-1">
          <AlertCircle className={`w-3 h-3 ${IMPACT_COLORS[task.impactLevel]}`} />
          <span className={`font-medium ${IMPACT_COLORS[task.impactLevel]}`}>
            {task.impactLevel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

