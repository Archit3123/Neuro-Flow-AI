import { NextResponse } from "next/server";
import { summarizeMeeting, transcribeAudio } from "@/lib/ai";
import { actionItemsToTaskPayloads } from "@/lib/automation";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const text = String(form.get("text") || "").trim();
    const audio = form.get("audio");

    if (!text && !(audio instanceof File)) {
      return NextResponse.json({ error: "Provide meeting notes or an audio recording." }, { status: 400 });
    }

    const transcript = text || await transcribeAudio(audio as File);
    const result = await summarizeMeeting(transcript);

    await prisma.meeting.create({
      data: {
        transcript,
        summary: result.summary,
        keyPoints: JSON.stringify(result.keyPoints || []),
        actionItems: JSON.stringify(result.actionItems || []),
        sourceName: audio instanceof File ? audio.name : "Pasted notes",
      },
    });

    const payloads = actionItemsToTaskPayloads(result.actionItems);
    const createdTasksFromDb = payloads.length
      ? await Promise.all(
          payloads.map((payload) =>
            prisma.task.create({
              data: {
                title: payload.title,
                description: "",
                status: "todo",
                priority: payload.priority,
                duration: payload.duration,
                source: payload.source,
                tags: JSON.stringify(payload.tags || []),
              },
            })
          )
        )
      : [];

    const createdTasks = createdTasksFromDb.map((t) => ({
      ...t,
      _id: t.id,
      tags: JSON.parse(t.tags || "[]"),
    }));

    return NextResponse.json({ transcript, ...result, createdTasks });
  } catch (error) {
    return apiError(error, "Unable to summarize this meeting.");
  }
}
