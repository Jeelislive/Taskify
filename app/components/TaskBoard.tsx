'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import CategoryColumn from './CategoryColumn';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
}

const CATEGORIES: Task['category'][] = ['Work', 'Personal', 'Health', 'Errands'];

export default function TaskBoard({
  tasks,
  onUpdateTasks,
  onToggleComplete,
  onDeleteTask,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dropping over a category
    if (CATEGORIES.includes(overId as Task['category'])) {
      const newCategory = overId as Task['category'];
      if (activeTask.category !== newCategory) {
        const updatedTasks = tasks.map((task) =>
          task.id === activeId ? { ...task, category: newCategory } : task
        );
        onUpdateTasks(updatedTasks);
      }
      return;
    }

    // Check if dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.category !== overTask.category) {
      // Moving to a different category
      const updatedTasks = tasks.map((task) =>
        task.id === activeId ? { ...task, category: overTask.category } : task
      );
      onUpdateTasks(updatedTasks);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dropped over a task in the same category, reorder
    if (overTask && activeTask.category === overTask.category) {
      const categoryTasks = tasks.filter((t) => t.category === activeTask.category);
      const activeIndex = categoryTasks.findIndex((t) => t.id === activeId);
      const overIndex = categoryTasks.findIndex((t) => t.id === overId);

      const reorderedCategoryTasks = arrayMove(categoryTasks, activeIndex, overIndex);
      const otherTasks = tasks.filter((t) => t.category !== activeTask.category);

      onUpdateTasks([...otherTasks, ...reorderedCategoryTasks]);
    }
  };

  const getTasksByCategory = (category: Task['category']) => {
    return tasks.filter((task) => task.category === category);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <CategoryColumn
            key={category}
            category={category}
            tasks={getTasksByCategory(category)}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <motion.div
            initial={{ scale: 1.05, rotate: 5 }}
            animate={{ scale: 1.05, rotate: 5 }}
            className="cursor-grabbing"
          >
            <TaskCard task={activeTask} />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

