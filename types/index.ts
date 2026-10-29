export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskShape {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  duration: number;
  dueDate?: string | null;
  scheduledAt?: string | null;
  tags: string[];
  source: "manual" | "ai" | "meeting";
  createdAt?: string;
}

export interface PlanItem { title: string; description?: string; duration: number; priority: TaskPriority; tags?: string[]; }
export interface ChatMessage { role: "user" | "assistant"; content: string; }
export interface MeetingResult { transcript: string; summary: string; keyPoints: string[]; actionItems: string[]; createdTasks?: TaskShape[]; }
