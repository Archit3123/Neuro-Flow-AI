import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

// A deterministic scheduling baseline; replace the policy with calendar-aware AI when external calendar availability is connected.
export async function POST() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: { not: "done" },
        scheduledAt: null,
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
      take: 12,
    });

    const cursor = new Date();
    cursor.setHours(9, 0, 0, 0);
    if (cursor < new Date()) {
      cursor.setDate(cursor.getDate() + 1);
    }

    const scheduled = [];
    for (const task of tasks) {
      const scheduledAt = new Date(cursor);
      const updated = await prisma.task.update({
        where: { id: task.id },
        data: { scheduledAt },
      });

      scheduled.push({
        ...updated,
        _id: updated.id,
        tags: JSON.parse(updated.tags || "[]"),
      });

      cursor.setMinutes(cursor.getMinutes() + task.duration + 15);
      if (cursor.getHours() >= 17) {
        cursor.setDate(cursor.getDate() + 1);
        cursor.setHours(9, 0, 0, 0);
      }
    }

    return NextResponse.json({ scheduled });
  } catch (error) {
    return apiError(error, "Unable to schedule tasks.");
  }
}
