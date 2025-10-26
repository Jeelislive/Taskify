'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import ProjectCard from './ProjectCard';

interface StatusColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  color?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export default function StatusColumn({ title, count, tasks, color = 'gray', onEdit, onDelete, onToggleComplete }: StatusColumnProps) {
  return (
    <div className="flex-1 min-w-[320px]">
      {/* Column Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {title} <span className="text-gray-400 font-normal">({count.toString().padStart(2, '0')})</span>
        </h2>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <ProjectCard 
            key={task.id} 
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
}

