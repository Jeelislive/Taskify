'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { CheckCircle2, Clock, TrendingUp, Target, Calendar, Zap } from 'lucide-react';
import StatsCard from './StatsCard';
import ProgressRing from './ProgressRing';
import CategoryChart from './CategoryChart';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface DashboardStatsProps {
  tasks: Task[];
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Tasks due today
  const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate))).length;
  
  // Overdue tasks
  const overdueTasks = tasks.filter(t => 
    !t.completed && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
  ).length;

  // High priority tasks
  const highPriorityTasks = tasks.filter(t => t.priorityLevel === 'P1' && !t.completed).length;

  // Tasks due tomorrow
  const tomorrowTasks = tasks.filter(t => isTomorrow(new Date(t.dueDate))).length;

  return (
    <div className="space-y-6 mb-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={Target}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          color="green"
          trend={{ value: Math.round(completionRate), isPositive: true }}
          delay={0.1}
        />
        <StatsCard
          title="Pending"
          value={pendingTasks}
          icon={Clock}
          color="orange"
          delay={0.2}
        />
        <StatsCard
          title="High Priority"
          value={highPriorityTasks}
          icon={Zap}
          color="pink"
          delay={0.3}
        />
      </div>

      {/* Middle Section: Progress and Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Progress Ring */}
        <div className="bg-[#151515] rounded-xl p-6 border border-[#1a1a1a] flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Overall Progress</h3>
          <ProgressRing 
            progress={completionRate} 
            size={140}
            strokeWidth={10}
            color="#8b5cf6"
          />
          <p className="text-gray-400 text-sm mt-4 text-center">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#151515] rounded-xl p-6 border border-[#1a1a1a] space-y-3">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Quick Stats</h3>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 font-medium">Due Today</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">{todayTasks}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 font-medium">Due Tomorrow</span>
            </div>
            <span className="text-2xl font-bold text-purple-400">{tomorrowTasks}</span>
          </motion.div>

          {overdueTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-400" />
                <span className="text-gray-300 font-medium">Overdue</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{overdueTasks}</span>
            </motion.div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-[#151515] rounded-xl p-6 border border-[#1a1a1a]">
          <CategoryChart tasks={tasks} />
        </div>
      </motion.div>
    </div>
  );
}

