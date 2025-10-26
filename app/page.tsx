'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mic, Plus } from 'lucide-react';
import { Task } from '@/lib/types';
import { 
  showTaskCreated, 
  showTaskCompleted, 
  showTaskDeleted, 
  showBulkDeleteToast,
  showErrorToast,
  showSuccessToast 
} from '@/lib/toast';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import RightPanel from './components/layout/RightPanel';
import StatusColumn from './components/cards/StatusColumn';
import CategoryColumn from './components/CategoryColumn';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Analytics from './components/views/Analytics';
import Calendar from './components/views/Calendar';
import Reports from './components/views/Reports';
import Completed from './components/views/Completed';
import EditTaskModal from './components/modals/EditTaskModal';

export default function Home() {
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.priorityLevel.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  }, [tasks, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Separate tasks by category (use filtered tasks if searching)
  const tasksToDisplay = searchQuery ? filteredTasks : tasks;
  const tasksByCategory = {
    Work: tasksToDisplay.filter(t => !t.completed && t.category === 'Work'),
    Personal: tasksToDisplay.filter(t => !t.completed && t.category === 'Personal'),
    Health: tasksToDisplay.filter(t => !t.completed && t.category === 'Health'),
    Errands: tasksToDisplay.filter(t => !t.completed && t.category === 'Errands'),
  };

  const loadTasks = async (showToast = false) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []);
        if (showToast) {
          showSuccessToast('Tasks refreshed successfully!');
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      if (showToast) {
        showErrorToast('Failed to load tasks');
      }
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
    showErrorToast(errorMessage);
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
      const parseResponse = await fetch('/api/parseTasks', {
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
      showTaskCreated(saveData.tasks.length);
      setTranscription('');
      setShowVoiceInput(false);
      console.log('Tasks saved to database:', saveData.tasks);
    } catch (error) {
      console.error('Error processing tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process tasks';
      setError(errorMessage);
      showErrorToast(errorMessage);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Determine the target category
    let newCategory: 'Work' | 'Personal' | 'Health' | 'Errands';
    
    // Check if dropped on a category column or on another task
    const validCategories = ['Work', 'Personal', 'Health', 'Errands'];
    if (validCategories.includes(over.id as string)) {
      // Dropped on a category column
      newCategory = over.id as 'Work' | 'Personal' | 'Health' | 'Errands';
    } else {
      // Dropped on another task - find that task's category
      const overTask = tasks.find(t => t.id === over.id);
      if (!overTask) return;
      newCategory = overTask.category;
    }
    
    // Only update if category changed
    if (activeTask.category === newCategory) return;
    
    // Update task category
    const updatedTask = { ...activeTask, category: newCategory };
    const updatedTasks = tasks.map(task =>
      task.id === active.id ? updatedTask : task
    );
    
    setTasks(updatedTasks);
    showSuccessToast(`Task moved to ${newCategory}`);

    // Sync with database
    try {
      await fetch(`/api/tasks/${activeTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory }),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      showErrorToast('Failed to update task');
      loadTasks();
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

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

      
      if (completed) {
        showTaskCompleted(task.title);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      showErrorToast('Failed to update task');
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistically update UI
    setTasks(tasks.filter(task => task.id !== taskId));

    // Sync with database
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      showTaskDeleted(task.title);
    } catch (error) {
      console.error('Error deleting task:', error);
      showErrorToast('Failed to delete task');
      loadTasks();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (updatedTask: Task) => {
    // Optimistically update UI
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));

    // Sync with database
    try {
      await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      showSuccessToast('Task updated successfully!');
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      showErrorToast('Failed to update task');
      loadTasks();
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    try {
      // Delete all completed tasks
      await Promise.all(
        completedTasks.map(task =>
          fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
        )
      );
      
      setTasks(tasks.filter(t => !t.completed));
      showBulkDeleteToast(completedTasks.length);
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      showErrorToast('Failed to clear completed tasks');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'completed':
        return <Completed tasks={tasks} onDelete={handleDeleteTask} />;
      case 'analytics':
        return <Analytics tasks={tasks} />;
      case 'calendar':
        return <Calendar tasks={tasks} />;
      case 'reports':
        return <Reports tasks={tasksToDisplay} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : showVoiceInput ? (
        <div className="max-w-3xl mx-auto">
          {!transcription ? (
            <>
              <VoiceRecorder
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleError}
              />
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowVoiceInput(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <TranscriptionDisplay
                text={transcription}
                onClear={handleClearTranscription}
                onConfirm={handleConfirmTranscription}
              />
              {isParsing && (
                <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-8 text-center">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    AI is analyzing your tasks...
                  </p>
                  <p className="text-sm text-gray-500">
                    Extracting tasks, categories, and due dates
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Action Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Projects Overview</h2>
              <p className="text-sm text-gray-500 mt-1">
                {tasks.length} total • {tasks.filter(t => t.completed).length} completed
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVoiceInput(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <Mic className="w-4 h-4" />
              Add New Task
            </motion.button>
          </div>

            {tasks.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No tasks yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding your first task with voice</p>
                <button
                  onClick={() => setShowVoiceInput(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
                >
                  🎤 Record Your Tasks
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CategoryColumn
                    category="Work"
                    tasks={tasksByCategory.Work}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onUpdateTask={handleUpdateTask}
                  />
                  <CategoryColumn
                    category="Personal"
                    tasks={tasksByCategory.Personal}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onUpdateTask={handleUpdateTask}
                  />
                  <CategoryColumn
                    category="Health"
                    tasks={tasksByCategory.Health}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onUpdateTask={handleUpdateTask}
                  />
                  <CategoryColumn
                    category="Errands"
                    tasks={tasksByCategory.Errands}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onUpdateTask={handleUpdateTask}
                  />
                </div>
              </DndContext>
            )}
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar 
        activeView={currentView} 
        onViewChange={setCurrentView}
      />
      <TopBar 
        userName="Megko" 
        subtitle="Lets organize your Daily Tasks" 
        onSearch={handleSearch}
      />
      <RightPanel tasks={tasks} />
      
      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
      
      {/* Main Content */}
      <div className="ml-64 mr-80 pt-24 px-8 pb-8">
        {renderView()}
      </div>
    </div>
  );
}

