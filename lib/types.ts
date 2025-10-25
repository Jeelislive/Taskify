export type TaskCategory = "Work" | "Personal" | "Health" | "Errands";

export type ImpactLevel = "Low" | "Medium" | "High";

export type PriorityLevel = "P1" | "P2" | "P3";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  dueDate: string;
  impactLevel: ImpactLevel;
  priorityLevel: PriorityLevel;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  position: number;
}

export interface TranscriptionResponse {
  text: string;
}

export interface ParsedTasksResponse {
  tasks: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "position">[];
}

