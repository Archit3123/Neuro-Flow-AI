import type { TaskShape } from "@/types";

export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}
export const getTasks = () => api<TaskShape[]>("/api/tasks");
