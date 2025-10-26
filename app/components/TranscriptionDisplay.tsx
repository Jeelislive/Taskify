'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import Button from './ui/Button';

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
      <div className="glass-strong rounded-3xl shadow-2xl border-2 border-gray-700/50 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-400" />
            <h3 className="text-3xl font-bold text-gray-100">
              Your Transcription
            </h3>
          </div>
          <motion.button
            onClick={onClear}
            className="text-gray-400 hover:text-red-400 transition-colors p-2.5 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/30"
            aria-label="Clear transcription"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
        
        <motion.div 
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border-2 border-purple-500/20 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onConfirm}
            variant="primary"
            size="lg"
            className="w-full"
            icon={
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
              </div>
            }
          >
            <span className="text-lg">Parse Tasks with AI</span>
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

