'use client';

import { Search, Bell, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TopBarProps {
  userName?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export default function TopBar({ userName = 'User', subtitle = 'Lets organize your Daily Tasks', onSearch }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="h-20 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Hello, {userName}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-10 py-2 bg-[#151515] border border-[#262626] rounded-xl text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-[#151515] rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 pl-2 pr-3 py-2 hover:bg-[#151515] rounded-xl transition-colors"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-900/50">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`} 
              alt={userName}
              className="w-full h-full"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-100">{userName}</p>
            <p className="text-xs text-gray-400">Team Member</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.button>
      </div>
    </div>
  );
}

