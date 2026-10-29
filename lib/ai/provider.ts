import type { ChatMessage, MeetingResult, PlanItem } from "@/types";

export interface AiProvider {
  createPlan(goal: string): Promise<PlanItem[]>;
  replyToChat(messages: ChatMessage[], taskContext: string): Promise<string>;
  summarizeMeeting(transcript: string): Promise<Omit<MeetingResult, "transcript">>;
  transcribeAudio(file: File): Promise<string>;
}
