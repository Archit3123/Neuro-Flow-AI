import type { ChatMessage, MeetingResult, PlanItem } from "@/types";
import { GroqProvider } from "./ai/groq-provider";
import type { AiProvider } from "./ai/provider";

let provider: AiProvider | undefined;

function getProvider(): AiProvider {
  if (provider) return provider;

  const providerName = process.env.AI_PROVIDER || "groq";
  if (providerName !== "groq") throw new Error("The configured AI provider is not supported.");

  // OPENAI_* is retained temporarily only to avoid breaking existing local
  // hackathon setup. New environments must use the GROQ_* contract.
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("AI provider credentials are not configured.");

  provider = new GroqProvider(apiKey, process.env.GROQ_MODEL || process.env.OPENAI_MODEL);
  return provider;
}

export async function createPlan(goal: string): Promise<PlanItem[]> {
  return getProvider().createPlan(goal);
}

export async function replyToChat(messages: ChatMessage[], taskContext: string) {
  return getProvider().replyToChat(messages, taskContext);
}

export async function summarizeMeeting(transcript: string): Promise<Omit<MeetingResult, "transcript">> {
  return getProvider().summarizeMeeting(transcript);
}

export async function transcribeAudio(file: File) {
  return getProvider().transcribeAudio(file);
}
