import { NextResponse } from "next/server";
import { z } from "zod";
import { createPlan } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const { goal, save = true } = z.object({
      goal: z.string().min(3),
      save: z.boolean().optional(),
    }).parse(await request.json());

    const plan = await createPlan(goal);
    let tasks: any[] = [];

    if (save) {
      const data = plan.map((item) => ({
        title: item.title,
        description: item.description || "",
        status: "todo",
        priority: item.priority || "medium",
        duration: item.duration || 30,
        source: "ai",
        tags: JSON.stringify(item.tags || []),
      }));

      const createdTasks = await Promise.all(
        data.map((taskData) => prisma.task.create({ data: taskData }))
      );

      tasks = createdTasks.map((t) => ({
        ...t,
        _id: t.id,
        tags: JSON.parse(t.tags || "[]"),
      }));
    }

    return NextResponse.json({ plan, tasks });
  } catch (error) {
    return apiError(error, "Unable to create plan.");
  }
}
