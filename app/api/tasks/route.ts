import { NextRequest, NextResponse } from 'next/server';
import { supabase, taskRowToTask, taskToTaskRow, TaskRow } from '@/lib/supabase';

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: error.message },
        { status: 500 }
      );
    }

    const tasks = (data as TaskRow[]).map(taskRowToTask);

    return NextResponse.json({ tasks, success: true });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks } = body;

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    // Convert tasks to database format
    const taskRows = tasks.map(taskToTaskRow);

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskRows)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create tasks', details: error.message },
        { status: 500 }
      );
    }

    const createdTasks = (data as TaskRow[]).map(taskRowToTask);

    return NextResponse.json({ 
      tasks: createdTasks, 
      success: true 
    });
  } catch (error) {
    console.error('Create tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to create tasks' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks - Update multiple tasks (for reordering)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks } = body;

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    // Update each task
    const updatePromises = tasks.map(task => {
      const taskRow = taskToTaskRow(task);
      return supabase
        .from('tasks')
        .update({ ...taskRow, updated_at: new Date().toISOString() })
        .eq('id', task.id)
        .select();
    });

    const results = await Promise.all(updatePromises);

    // Check for errors
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Update errors:', errors);
      return NextResponse.json(
        { error: 'Failed to update some tasks' },
        { status: 500 }
      );
    }

    const updatedTasks = results
      .map(r => r.data?.[0])
      .filter(Boolean)
      .map(taskRowToTask);

    return NextResponse.json({ 
      tasks: updatedTasks, 
      success: true 
    });
  } catch (error) {
    console.error('Update tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
}

