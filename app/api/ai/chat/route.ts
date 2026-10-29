import { NextResponse } from "next/server";
import { z } from "zod";
import { replyToChat } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const { messages } = z.object({
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().min(1),
        })
      ).min(1),
    }).parse(await request.json());

    const tasksFromDb = await prisma.task.findMany({
      take: 30,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
      },
    });

    const tasks = tasksFromDb.map((t) => ({
      ...t,
      _id: t.id,
    }));

    const content = await replyToChat(messages, JSON.stringify(tasks));
    return NextResponse.json({ content });
  } catch (error) {
    return apiError(error, "Unable to answer right now.");
  }
}
