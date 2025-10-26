'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Plus, Trash2, Edit, X } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export interface ActivityLogEntry {
  id: string;
  type: 'created' | 'completed' | 'deleted' | 'updated';
  taskTitle: string;
  timestamp: Date;
}

interface ActivityLogProps {
  activities: ActivityLogEntry[];
  onClose?: () => void;
}

const activityIcons = {
  created: Plus,
  completed: CheckCircle2,
  deleted: Trash2,
  updated: Edit,
};

const activityColors = {
  created: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', icon: 'text-blue-400' },
  completed: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', icon: 'text-green-400' },
  deleted: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-400' },
  updated: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: 'text-yellow-400' },
};

const activityLabels = {
  created: 'Created',
  completed: 'Completed',
  deleted: 'Deleted',
  updated: 'Updated',
};

export default function ActivityLog({ activities, onClose }: ActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#151515] rounded-xl p-4 border border-[#1a1a1a] h-fit sticky top-8"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wide">Activity</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-gray-300"
          >
            {isExpanded ? '−' : '+'}
          </motion.button>
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin"
          >
            {activities.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">No activity yet</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const colors = activityColors[activity.type];
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-2.5 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded ${colors.bg} border ${colors.border}`}>
                        <Icon className={`w-3 h-3 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${colors.text}`}>
                          {activityLabels[activity.type]}
                        </p>
                        <p className="text-gray-300 text-xs truncate mt-0.5">
                          {activity.taskTitle}
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          {format(activity.timestamp, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

