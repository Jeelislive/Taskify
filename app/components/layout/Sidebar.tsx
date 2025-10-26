'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  Calendar,
  FileText,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: CheckCircle2, label: 'Completed', id: 'completed' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: FileText, label: 'Reports', id: 'reports' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-100">Baaz</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-900/20 text-indigo-400' 
                  : 'text-gray-400 hover:bg-[#151515]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

