'use client';

import { useState } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import TaskList from './components/TaskList';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Task } from '@/lib/types';

export default function Home() {
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  const handleClearTranscription = () => {
    setTranscription('');
    setTasks([]);
  };

  const handleConfirmTranscription = async () => {
    setIsParsing(true);
    try {
      console.log('Parsing transcription:', transcription);
      
      // Step 1: Parse tasks with AI
      const parseResponse = await fetch('/api/parse-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcription }),
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok) {
        throw new Error(parseData.error || 'Failed to parse tasks');
      }

      // Step 2: Prepare tasks with metadata
      const tasksToSave = parseData.tasks.map((task: any, index: number) => ({
        ...task,
        completed: false,
        position: index,
      }));

      // Step 3: Save tasks to Supabase
      const saveResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: tasksToSave }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.error || 'Failed to save tasks');
      }

      setTasks(saveData.tasks);
      console.log('Tasks saved to database:', saveData.tasks);
    } catch (error) {
      console.error('Error processing tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process tasks';
      setError(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  const handleBackToRecording = () => {
    setTranscription('');
    setTasks([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
           
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Baaz Task Manager
            </h1>
           
          </motion.div>
          <motion.p 
            className="text-2xl text-gray-700 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Speak your tasks, let AI organize them
          </motion.p>
          <motion.div
            className="mt-4 inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-gray-600">
              Powered by Free AI - No costs, No limits
            </p>
          </motion.div>
        </motion.header>

        <div className="flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="max-w-md w-full bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {!transcription ? (
              <>
                <VoiceRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onError={handleError}
                />
                <motion.div
                  className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm border-2 border-blue-300 rounded-xl p-5 shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                    💡 How to use (IMPORTANT!)
                  </h3>
                  <div className="space-y-2 text-sm text-blue-900">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <p>Click mic button → Allow microphone access</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <p>Wait for yellow box that says "Waiting for speech..."</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <p><strong>START SPEAKING</strong> - speak clearly for at least 5 seconds</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <p>Watch yellow box turn <strong className="text-green-700">GREEN</strong> with your words!</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">5.</span>
                      <p>Keep talking until done, then click STOP</p>
                    </div>
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-400 rounded">
                      <p className="text-xs text-yellow-900">
                        ⚠️ <strong>If you don't see the GREEN box</strong>, your mic isn't picking up audio. Speak louder or check mic permissions!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : tasks.length === 0 ? (
              <>
                <TranscriptionDisplay
                  text={transcription}
                  onClear={handleClearTranscription}
                  onConfirm={handleConfirmTranscription}
                />
                {isParsing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 text-center"
                  >
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-3" />
                    <p className="text-lg font-bold text-purple-900 mb-1">
                      AI is analyzing your tasks...
                    </p>
                    <p className="text-sm text-purple-700">
                      Extracting tasks, categories, and due dates
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your Tasks ({tasks.length})
                  </h2>
                  <motion.button
                    onClick={handleBackToRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    New Recording
                  </motion.button>
                </div>

                <TaskList tasks={tasks} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

