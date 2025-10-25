import { createClient } from '@supabase/supabase-js';
import { Task } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database type for tasks table
export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  due_date: string;
  impact_level: string;
  priority_level: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

// Convert database row to Task type
export function taskRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category as Task['category'],
    dueDate: row.due_date,
    impactLevel: row.impact_level as Task['impactLevel'],
    priorityLevel: row.priority_level as Task['priorityLevel'],
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    position: row.position,
  };
}

// Convert Task type to database row
export function taskToTaskRow(task: Partial<Task>): Partial<TaskRow> {
  return {
    ...(task.id && { id: task.id }),
    ...(task.title && { title: task.title }),
    ...(task.description !== undefined && { description: task.description || null }),
    ...(task.category && { category: task.category }),
    ...(task.dueDate && { due_date: task.dueDate }),
    ...(task.impactLevel && { impact_level: task.impactLevel }),
    ...(task.priorityLevel && { priority_level: task.priorityLevel }),
    ...(task.completed !== undefined && { completed: task.completed }),
    ...(task.position !== undefined && { position: task.position }),
  };
}

