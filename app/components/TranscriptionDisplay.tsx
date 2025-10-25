'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

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
      className="w-full max-w-2xl"
    >
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Transcription
          </h3>
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear transcription"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </div>

        <motion.button
          onClick={onConfirm}
          className="w-full btn-primary flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle className="w-5 h-5" />
          Parse Tasks with AI
        </motion.button>
      </div>
    </motion.div>
  );
}

