'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Clock, Sparkles } from 'lucide-react';
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
  const [interimText, setInterimText] = useState('');
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
      setInterimText('');
      startTimer();

      speechRecognitionRef.current.startRecognition(
        (text) => {
          setIsRecording(false);
          stopTimer();
          setIsProcessing(false);
          setInterimText('');
          onTranscriptionComplete(text);
        },
        (error) => {
          setIsRecording(false);
          stopTimer();
          setIsProcessing(false);
          setInterimText('');
          onError(error);
        },
        (interim) => {
          setInterimText(interim);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to start recording';
      onError(errorMessage);
      setIsRecording(false);
      stopTimer();
      setInterimText('');
    }
  };

  const handleStopRecording = () => {
    if (speechRecognitionRef.current) {
      setIsProcessing(true);
      setInterimText('');
      speechRecognitionRef.current.stopRecognition();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-12 glass-strong rounded-3xl shadow-2xl border-2 border-gray-700/50">
      <motion.button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isProcessing}
        className={`
          relative w-32 h-32 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-2xl
          ${isRecording 
            ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/50' 
            : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-purple-500/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: isProcessing ? 1 : 1.15 }}
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
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Square className="w-10 h-10 text-white fill-white" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="w-10 h-10 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-400"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3
              }}
            />
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            key="recording-status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 w-full max-w-xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Mic className="w-6 h-6 text-red-400" />
              </motion.div>
              <motion.p 
                className="text-red-400 font-bold text-2xl"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Recording...
              </motion.p>
            </div>
            <p className="text-gray-100 font-mono text-3xl font-bold">{formatTime(recordingTime)}</p>
                  <div className="text-center">
                    <p className="text-gray-700 text-base font-medium">Speak clearly into your microphone</p>
                    <p className="text-gray-500 text-sm mt-1">Keep speaking until you're done, then click stop</p>
                  </div>
            
            <AnimatePresence>
              {interimText ? (
                <motion.div
                  key="interim-text"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="mt-3 w-full bg-green-500/10 border-2 border-green-500/30 rounded-xl p-5 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      className="w-2.5 h-2.5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <p className="text-sm font-semibold text-green-300">Listening... (Keep talking!)</p>
                  </div>
                      <p className="text-gray-900 text-base font-medium leading-relaxed">{interimText}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 w-full bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                    <p className="text-sm text-yellow-300 text-center font-medium">
                      Waiting for speech... Start talking now!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            key="processing-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-purple-400 font-bold text-xl mb-2">
              Processing audio...
            </p>
            <p className="text-gray-400 text-sm">Converting speech to text</p>
          </motion.div>
        )}

        {!isRecording && !isProcessing && (
          <motion.div
            key="idle-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center gap-2">
              {isAvailable ? (
                <>
                  <Mic className="w-6 h-6 text-purple-400" />
                  <p className="text-gray-200 text-xl font-semibold">
                    Click the button to start recording
                  </p>
                </>
              ) : (
                <p className="text-gray-200 text-xl font-semibold">
                  ❌ Speech recognition not available
                </p>
              )}
            </div>
            {isAvailable && (
              <>
                <p className="text-gray-400 text-base">
                  Example: "Schedule meeting tomorrow at 2pm, buy groceries today"
                </p>
                <p className="text-gray-500 text-sm">
                  Free browser-based speech recognition
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>No API costs • No limits</span>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
