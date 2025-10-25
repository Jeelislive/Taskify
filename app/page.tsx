'use client';

import { useState, useEffect } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import TaskBoard from './components/TaskBoard';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Task } from '@/lib/types';

export default function Home() {
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setShowVoiceInput(false);
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

      // Reload all tasks to get the updated list
      await loadTasks();
      setTranscription('');
      setShowVoiceInput(false);
      console.log('Tasks saved to database:', saveData.tasks);
    } catch (error) {
      console.error('Error processing tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process tasks';
      setError(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpdateTasks = async (updatedTasks: Task[]) => {
    // Optimistically update UI
    setTasks(updatedTasks);

    // Sync with database
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks }),
      });
    } catch (error) {
      console.error('Error updating tasks:', error);
      setError('Failed to update tasks');
      // Reload tasks to revert to server state
      loadTasks();
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    // Optimistically update UI
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));

    // Sync with database
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task');
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistically update UI
    setTasks(tasks.filter(task => task.id !== taskId));

    // Sync with database
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
      loadTasks();
    }
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

          <div className="w-full max-w-7xl">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading your tasks...</p>
              </motion.div>
            ) : showVoiceInput ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto"
              >
                {!transcription ? (
                  <>
                    <VoiceRecorder
                      onTranscriptionComplete={handleTranscriptionComplete}
                      onError={handleError}
                    />
                    <motion.button
                      onClick={() => setShowVoiceInput(false)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Dashboard
                    </motion.button>
                  </>
                ) : (
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
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Your Task Board
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • Drag to organize
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setShowVoiceInput(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Tasks with Voice
                  </motion.button>
                </div>

                {tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300"
                  >
                    <div className="text-6xl mb-4">🎙️</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No tasks yet!</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first task with voice</p>
                    <motion.button
                      onClick={() => setShowVoiceInput(true)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎤 Record Your Tasks
                    </motion.button>
                  </motion.div>
                ) : (
                  <TaskBoard
                    tasks={tasks}
                    onUpdateTasks={handleUpdateTasks}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

