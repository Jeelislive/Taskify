'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import TaskCard from './TaskCard';
import Badge from './ui/Badge';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Briefcase, Star, Heart, ShoppingCart } from 'lucide-react';

interface CategoryColumnProps {
  category: Task['category'];
  tasks: Task[];
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onUpdateTask?: (updatedTask: Task) => void;
}

const categoryIcons = {
  Work: Briefcase,
  Personal: Star,
  Health: Heart,
  Errands: ShoppingCart,
};

const categoryIconColors = {
  Work: 'text-blue-400',
  Personal: 'text-purple-400',
  Health: 'text-green-400',
  Errands: 'text-orange-400',
};

export default function CategoryColumn({
  category,
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdateTask,
}: CategoryColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  const taskIds = tasks.map(task => task.id);
  const categoryColors = CATEGORY_COLORS[category];
  const CategoryIcon = categoryIcons[category];
  const iconColor = categoryIconColors[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-[#151515] p-4 rounded-xl mb-3 border border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${categoryColors.bg} border ${categoryColors.border}`}>
              <CategoryIcon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wide">
              {category}
            </h3>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 p-3 rounded-xl border border-dashed min-h-[500px]
          transition-all duration-200 scrollbar-thin overflow-y-auto
          ${isOver
            ? `${categoryColors.bg} ${categoryColors.border}`
            : 'border-[#1a1a1a] bg-transparent'
          }
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                <div className="mb-3 opacity-20">
                  <CategoryIcon className={`w-12 h-12 ${iconColor}`} />
                </div>
                <p className="text-xs text-center">
                  No tasks
                  <span className="block text-gray-700 mt-1">Drag tasks here</span>
                </p>
              </div>
            ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onUpdateTask={onUpdateTask}
                    />
                  ))
            )}
          </div>
        </SortableContext>
      </div>
    </motion.div>
  );
}

