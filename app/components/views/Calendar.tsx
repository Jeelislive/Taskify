'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarProps {
  tasks: Task[];
}

export default function Calendar({ tasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Gantt chart view
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const earliestDate = tasks.length > 0 
    ? new Date(Math.min(...tasks.map(t => new Date(t.dueDate).getTime())))
    : new Date();
  
  const latestDate = tasks.length > 0
    ? new Date(Math.max(...tasks.map(t => new Date(t.dueDate).getTime())))
    : addDays(new Date(), 30);

  const daysDiff = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const timelineDays = Array.from({ length: daysDiff }, (_, i) => addDays(earliestDate, i));

  const categoryColors: Record<string, string> = {
    Work: 'bg-blue-500',
    Personal: 'bg-purple-500',
    Health: 'bg-green-500',
    Errands: 'bg-amber-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gantt Chart View</h2>
          <p className="text-gray-500 mt-1">Task timeline and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-500">No tasks to display in calendar view</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 overflow-x-auto"
        >
          {/* Timeline Header */}
          <div className="flex mb-4 border-b border-gray-200 pb-2">
            <div className="w-48 flex-shrink-0 font-semibold text-gray-900">Task</div>
            <div className="flex-1 flex">
              {timelineDays.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-[60px] text-center"
                >
                  <div className="text-xs font-semibold text-gray-900">
                    {format(day, 'MMM dd')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(day, 'EEE')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Bars */}
          <div className="space-y-3">
            {sortedTasks.map((task, taskIndex) => {
              const taskDate = new Date(task.dueDate);
              const dayIndex = Math.floor((taskDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
              const barWidth = 2; // Days the task spans (you can make this dynamic)

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: taskIndex * 0.05 }}
                  className="flex items-center"
                >
                  {/* Task Name */}
                  <div className="w-48 flex-shrink-0 pr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.category}</p>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative h-12 flex items-center">
                    <div className="absolute inset-0 flex">
                      {timelineDays.map((_, index) => (
                        <div
                          key={index}
                          className="flex-1 min-w-[60px] border-r border-gray-100"
                        />
                      ))}
                    </div>
                    
                    {/* Task Bar */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 + taskIndex * 0.05, duration: 0.5 }}
                      className={`absolute h-8 ${categoryColors[task.category] || 'bg-gray-500'} rounded-lg shadow-md flex items-center px-3 ${task.completed ? 'opacity-50' : ''}`}
                      style={{
                        left: `${(dayIndex / daysDiff) * 100}%`,
                        width: `${(barWidth / daysDiff) * 100}%`,
                        minWidth: '80px',
                      }}
                    >
                      <span className="text-white text-xs font-semibold truncate">
                        {task.priorityLevel} {task.completed && '✓'}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-4 flex-wrap">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${color} rounded`}></div>
                <span className="text-sm text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}


