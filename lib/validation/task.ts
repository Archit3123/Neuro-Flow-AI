import { z } from "zod";

const optionalDate = z.string().datetime().nullable().optional();
const priority = z.enum(["low", "medium", "high"]);
const status = z.enum(["todo", "in_progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(180),
  description: z.string().max(5_000).optional(),
  status: status.optional(),
  priority: priority.optional(),
  duration: z.number().int().min(1).max(1_440).optional(),
  dueDate: optionalDate,
  scheduledAt: optionalDate,
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  source: z.enum(["manual", "ai", "meeting"]).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required.",
);
