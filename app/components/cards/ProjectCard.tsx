'use client';

import { motion } from 'framer-motion';
import { MoreVertical, MessageSquare, Paperclip, Edit2, Trash2, Check } from 'lucide-react';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { useState } from 'react';

interface ProjectCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

const categoryColors: Record<string, string> = {
  Work: 'bg-cyan-100 text-cyan-700',
  Personal: 'bg-purple-100 text-purple-700',
  Health: 'bg-green-100 text-green-700',
  Errands: 'bg-amber-100 text-amber-700',
};

export default function ProjectCard({ task, onClick, onEdit, onDelete, onToggleComplete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-base font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
              >
                {onToggleComplete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id, !task.completed);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {task.completed ? 'Mark as In Progress' : 'Mark Complete'}
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this task?')) {
                        onDelete(task.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Task
                  </button>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${categoryColors[task.category] || 'bg-gray-100 text-gray-700'}`}>
          {task.category}
        </span>
        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
          {task.priorityLevel}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
        {task.completed && (
          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
            <Check className="w-3 h-3" />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}

