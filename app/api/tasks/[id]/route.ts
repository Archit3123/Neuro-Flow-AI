import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, apiError } from "@/lib/api-error";
import { updateTaskSchema } from "@/lib/validation/task";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const update = updateTaskSchema.parse(await request.json());

    const taskExists = await prisma.task.findUnique({ where: { id } });
    if (!taskExists) throw new ApiError(404, "Task not found.");

    const data: Record<string, unknown> = {};
    if (update.title !== undefined) data.title = update.title;
    if (update.description !== undefined) data.description = update.description;
    if (update.status !== undefined) data.status = update.status;
    if (update.priority !== undefined) data.priority = update.priority;
    if (update.duration !== undefined) data.duration = update.duration;
    if (update.dueDate !== undefined) data.dueDate = update.dueDate ? new Date(update.dueDate) : null;
    if (update.scheduledAt !== undefined) data.scheduledAt = update.scheduledAt ? new Date(update.scheduledAt) : null;
    if (update.tags !== undefined) data.tags = Array.isArray(update.tags) ? JSON.stringify(update.tags) : "[]";
    if (update.source !== undefined) data.source = update.source;

    const t = await prisma.task.update({
      where: { id },
      data,
    });

    const task = {
      ...t,
      _id: t.id,
      tags: JSON.parse(t.tags || "[]")
    };

    return NextResponse.json(task);
  } catch (error) {
    return apiError(error, "Unable to update task.");
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const taskExists = await prisma.task.findUnique({ where: { id } });
    if (!taskExists) throw new ApiError(404, "Task not found.");

    await prisma.task.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error, "Unable to delete task.");
  }
}
