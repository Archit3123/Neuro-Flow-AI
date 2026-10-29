import type { TaskShape } from "@/types";

// Central place for small, predictable automation rules. Add integrations here later.
export function taskScheduleSuggestion(
  task: Pick<TaskShape, "title" | "duration"> & { priority: string }
) {
  const urgency = task.priority === "high" ? "today" : "this week";
  return `Schedule “${task.title}” for a focused ${task.duration}-minute block ${urgency}.`;
}

export function actionItemsToTaskPayloads(actionItems: string[]) {
  return actionItems.filter(Boolean).map((title) => ({ title, duration: 30, priority: "medium" as const, source: "meeting" as const, tags: ["meeting"] }));
}
