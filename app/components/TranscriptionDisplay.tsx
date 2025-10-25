'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle, Sparkles } from 'lucide-react';

interface TranscriptionDisplayProps {
  text: string;
  onClear: () => void;
  onConfirm: () => void;
}

export default function TranscriptionDisplay({ 
  text, 
  onClear,
  onConfirm 
}: TranscriptionDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Transcription
            </h3>
          </div>
          <motion.button
            onClick={onClear}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            aria-label="Clear transcription"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
        
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-purple-200 shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </motion.div>

        <motion.button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle className="w-6 h-6" />
          <span className="text-lg">Parse Tasks with AI</span>
          <Sparkles className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

