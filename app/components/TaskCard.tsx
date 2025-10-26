'use client';

import { motion } from 'framer-motion';
import { Calendar, Trash2, Check, Edit2, Eye, Tag } from 'lucide-react';
import { Task } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Badge from './ui/Badge';
import { useState } from 'react';
import ViewTaskModal from './modals/ViewTaskModal';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
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

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit, onUpdateTask }: TaskCardProps) {
  const [showViewModal, setShowViewModal] = useState(false);
  
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

  const categoryColors = CATEGORY_COLORS[task.category];

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`
          group relative
          bg-[#151515] rounded-lg p-4 
          border ${categoryColors.border}
          cursor-grab active:cursor-grabbing
          hover:border-[#262626]
          transition-all duration-200
          ${isDragging ? 'opacity-30 scale-105' : ''}
          ${task.completed ? 'opacity-50' : ''}
        `}
      >
      {/* Category indicator strip */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 bg-${categoryColors.border.split('-')[1]}-600 rounded-r`}></div>

      <div className="flex items-start justify-between gap-3 mb-3 ml-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={priorityVariants[task.priorityLevel]} size="sm">
              {task.priorityLevel}
            </Badge>
            <Badge variant={impactVariants[task.impactLevel]} size="sm">
              {task.impactLevel} Impact
            </Badge>
          </div>

          <h4 className={`text-sm font-semibold text-gray-100 mb-1 break-words ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>

              {task.description && (
                <p className="text-gray-500 text-xs mb-2 line-clamp-3 break-words">
                  {task.description}
                </p>
              )}
        </div>

            <div className="flex gap-1 flex-shrink-0">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewModal(true);
                }}
                className="p-1.5 text-purple-400 hover:bg-purple-950 rounded transition-all border border-transparent hover:border-purple-900"
                whileTap={{ scale: 0.95 }}
                title="View full task"
              >
                <Eye className="w-3.5 h-3.5" />
              </motion.button>
              {onEdit && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1.5 text-blue-400 hover:bg-blue-950 rounded transition-all border border-transparent hover:border-blue-900"
                  whileTap={{ scale: 0.95 }}
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </motion.button>
              )}
              {onToggleComplete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id, !task.completed);
              }}
              className={`p-1.5 rounded transition-all ${
                task.completed
                  ? 'bg-green-950 text-green-400 hover:bg-green-900 border border-green-900'
                  : 'bg-gray-900 text-gray-500 hover:bg-gray-800 border border-gray-800'
              }`}
              whileTap={{ scale: 0.95 }}
              title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <Check className="w-3.5 h-3.5" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 text-red-400 hover:bg-red-950 rounded transition-all border border-transparent hover:border-red-900"
              whileTap={{ scale: 0.95 }}
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs ml-3">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          <span className="text-xs">{format(new Date(task.dueDate), 'MMM dd')}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Tag className={`w-3 h-3 ${categoryColors.text}`} />
          <span className="text-xs">{task.category}</span>
        </div>
      </div>
    </motion.div>

      {/* View Task Modal */}
      <ViewTaskModal
        task={task}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onUpdateTask={onUpdateTask}
      />
    </>
  );
}

