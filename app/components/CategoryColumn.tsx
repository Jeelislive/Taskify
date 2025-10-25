'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface CategoryColumnProps {
  category: Task['category'];
  tasks: Task[];
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
}

export default function CategoryColumn({
  category,
  tasks,
  onToggleComplete,
  onDelete,
}: CategoryColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      <div
        className={`
          mb-4 p-4 rounded-xl border-2
          ${CATEGORY_COLORS[category].bg}
          ${CATEGORY_COLORS[category].border}
        `}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${CATEGORY_COLORS[category].text}`}>
            {category}
          </h3>
          <span className={`
            text-sm font-bold px-3 py-1 rounded-full
            ${CATEGORY_COLORS[category].text}
            bg-white bg-opacity-70
          `}>
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`
          flex-1 p-4 rounded-xl border-2 border-dashed min-h-[400px]
          transition-all duration-200
          ${isOver
            ? `${CATEGORY_COLORS[category].bg} ${CATEGORY_COLORS[category].border} bg-opacity-20`
            : 'border-gray-200 bg-gray-50 bg-opacity-50'
          }
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No tasks yet. Drag tasks here!
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </motion.div>
  );
}

