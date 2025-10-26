'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Filter,
  Search,
  SortAsc,
  Download,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import Badge from './ui/Badge';

interface QuickActionsProps {
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onSortChange: (sort: 'date' | 'priority' | 'category') => void;
  onSearchChange: (search: string) => void;
  onClearCompleted: () => void;
  onRefresh: () => void;
  currentFilter: 'all' | 'active' | 'completed';
  completedCount: number;
  activeCount: number;
}

export default function QuickActions({
  onFilterChange,
  onSortChange,
  onSearchChange,
  onClearCompleted,
  onRefresh,
  currentFilter,
  completedCount,
  activeCount,
}: QuickActionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151515] rounded-xl p-4 border border-[#1a1a1a] mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            onClick={() => onFilterChange('all')}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2
              ${currentFilter === 'all' 
                ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-900' 
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-400'
              }`}
          >
            <Filter className="w-4 h-4" />
            All
            <Badge variant="secondary" size="sm">{activeCount + completedCount}</Badge>
          </motion.button>

          <motion.button
            onClick={() => onFilterChange('active')}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2
              ${currentFilter === 'active' 
                ? 'bg-blue-950/50 text-blue-300 border border-blue-900' 
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-400'
              }`}
          >
            <Circle className="w-4 h-4" />
            Active
            <Badge variant="info" size="sm">{activeCount}</Badge>
          </motion.button>

          <motion.button
            onClick={() => onFilterChange('completed')}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2
              ${currentFilter === 'completed' 
                ? 'bg-green-950/50 text-green-300 border border-green-900' 
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-400'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completed
            <Badge variant="success" size="sm">{completedCount}</Badge>
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onRefresh}
            whileTap={{ scale: 0.95, rotate: 90 }}
            className="p-2 bg-gray-900 text-gray-500 border border-gray-800 rounded-lg hover:border-gray-700 hover:text-gray-400 transition-all"
            title="Refresh tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          {completedCount > 0 && (
            <motion.button
              onClick={onClearCompleted}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-1.5 bg-red-950/50 text-red-300 border border-red-900 rounded-lg hover:border-red-800 transition-all flex items-center gap-2 font-medium text-sm"
              title="Clear completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* Sort Options - Expandable */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700/50">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Sort by:</span>
          <div className="flex gap-2">
            {['date', 'priority', 'category'].map((sort) => (
              <motion.button
                key={sort}
                onClick={() => onSortChange(sort as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gray-700/30 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-all text-xs font-medium capitalize"
              >
                {sort}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setShowFilters(!showFilters)}
        className="text-xs text-gray-500 hover:text-gray-400 mt-2 flex items-center gap-1"
      >
        {showFilters ? '− Less options' : '+ More options'}
      </motion.button>
    </motion.div>
  );
}

