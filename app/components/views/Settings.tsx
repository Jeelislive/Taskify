'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function Settings({ onThemeChange }: SettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    
    // Apply theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your preferences</p>
      </div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Appearance</h3>
        <p className="text-gray-600 text-sm mb-6">Select your preferred theme</p>

        <div className="grid grid-cols-3 gap-4">
          {/* Light Theme */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border-2 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                theme === 'light' ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <Sun className={`w-6 h-6 ${
                  theme === 'light' ? 'text-indigo-600' : 'text-gray-600'
                }`} />
              </div>
              <span className={`font-medium ${
                theme === 'light' ? 'text-indigo-600' : 'text-gray-700'
              }`}>
                Light
              </span>
            </div>
          </motion.button>

          {/* Dark Theme */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border-2 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <Moon className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-indigo-600' : 'text-gray-600'
                }`} />
              </div>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-indigo-600' : 'text-gray-700'
              }`}>
                Dark
              </span>
            </div>
          </motion.button>

          {/* System Theme */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-xl border-2 transition-all ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                theme === 'system' ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <Monitor className={`w-6 h-6 ${
                  theme === 'system' ? 'text-indigo-600' : 'text-gray-600'
                }`} />
              </div>
              <span className={`font-medium ${
                theme === 'system' ? 'text-indigo-600' : 'text-gray-700'
              }`}>
                System
              </span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Other Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">Task reminders</span>
            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">Daily summary</span>
            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700">Achievement notifications</span>
            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
          </label>
        </div>
      </motion.div>
    </div>
  );
}


