import OpenAI from "openai";
import type { ChatMessage, MeetingResult, PlanItem } from "@/types";
import type { AiProvider } from "./provider";

export class GroqProvider implements AiProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, model = "llama-3.1-8b-instant") {
    this.client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
    this.model = model;
  }

  private async jsonCompletion<T>(system: string, user: string): Promise<T> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    });

    return JSON.parse(completion.choices[0]?.message.content || "{}") as T;
  }

  async createPlan(goal: string): Promise<PlanItem[]> {
    const result = await this.jsonCompletion<{ tasks: PlanItem[] }>(
      "You are a practical productivity planner. Return JSON only: {tasks:[{title,description,duration,priority,tags}]}. Create 3-8 concrete, ordered tasks. duration is minutes; priority is low, medium, or high.",
      goal,
    );
    return result.tasks || [];
  }

  async replyToChat(messages: ChatMessage[], taskContext: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.7,
      messages: [
        { role: "system", content: `You are NeuroFlow, a concise helpful AI productivity coach. Current tasks context: ${taskContext}. Give practical answers. If the user asks to create tasks, propose a compact actionable list.` },
        ...messages.map((message) => ({ role: message.role, content: message.content })),
      ],
    });
    return response.choices[0]?.message.content || "I couldn't generate a response just now.";
  }

  async summarizeMeeting(transcript: string): Promise<Omit<MeetingResult, "transcript">> {
    return this.jsonCompletion(
      "You summarize meetings. Return JSON only: {summary:string,keyPoints:string[],actionItems:string[]}. Keep action items atomic and actionable.",
      transcript,
    );
  }

  async transcribeAudio(file: File): Promise<string> {
    const result = await this.client.audio.transcriptions.create({ file, model: "whisper-large-v3" });
    return result.text;
  }
}
