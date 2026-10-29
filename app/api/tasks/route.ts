import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskScheduleSuggestion } from "@/lib/automation";
import { apiError } from "@/lib/api-error";
import { createTaskSchema } from "@/lib/validation/task";

export async function GET() {
  try {
    const tasksFromDb = await prisma.task.findMany({
      orderBy: [
        { scheduledAt: "asc" },
        { createdAt: "desc" }
      ]
    });

    const tasks = tasksFromDb.map((task) => ({
      ...task,
      _id: task.id,
      tags: JSON.parse(task.tags || "[]")
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    return apiError(error, "Unable to load tasks.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createTaskSchema.parse(body);

    const t = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description || "",
        status: input.status || "todo",
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        duration: typeof body.duration === "number" ? body.duration : 30,
        priority: typeof body.priority === "string" ? body.priority : "medium",
        source: typeof body.source === "string" ? body.source : "manual",
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : "[]",
      }
    });

    const task = {
      ...t,
      _id: t.id,
      tags: JSON.parse(t.tags || "[]")
    };

    return NextResponse.json(
      {
        task,
        automation: taskScheduleSuggestion(task),
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error, "Unable to create task.");
  }
}
