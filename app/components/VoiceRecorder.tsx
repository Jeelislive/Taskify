'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { SpeechRecognitionService } from '@/lib/speech-recognition';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onError: (error: string) => void;
}

export default function VoiceRecorder({ 
  onTranscriptionComplete, 
  onError 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    speechRecognitionRef.current = new SpeechRecognitionService();
    setIsAvailable(speechRecognitionRef.current.isAvailable());
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    try {
      if (!speechRecognitionRef.current || !isAvailable) {
        onError('Speech recognition not available in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      setIsRecording(true);
      startTimer();

      speechRecognitionRef.current.startRecognition(
        (text) => {
          setIsRecording(false);
          stopTimer();
          setIsProcessing(false);
          onTranscriptionComplete(text);
        },
        (error) => {
          setIsRecording(false);
          stopTimer();
          setIsProcessing(false);
          onError(error);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to start recording';
      onError(errorMessage);
      setIsRecording(false);
      stopTimer();
    }
  };

  const handleStopRecording = () => {
    if (speechRecognitionRef.current) {
      setIsProcessing(true);
      speechRecognitionRef.current.stopRecognition();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isProcessing}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-primary-600 hover:bg-primary-700'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: isProcessing ? 1 : 1.05 }}
        whileTap={{ scale: isProcessing ? 1 : 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-red-600 font-semibold">Recording...</p>
            <p className="text-gray-600 font-mono">{formatTime(recordingTime)}</p>
          </motion.div>
        )}

        {isProcessing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-primary-600 font-medium"
          >
            Processing audio...
          </motion.p>
        )}

        {!isRecording && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-gray-600 text-sm">
              {isAvailable 
                ? 'Click to start recording your tasks' 
                : 'Speech recognition not available'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Free browser-based speech recognition
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
