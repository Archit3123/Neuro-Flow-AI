import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly publicMessage: string) {
    super(publicMessage);
  }
}

export function apiError(error: unknown, fallback = "Unable to process your request.") {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.publicMessage }, { status: error.status });
  }

  // Keep diagnostic detail on the server. Provider and database messages can
  // reveal implementation details and should never become client responses.
  console.error("Unhandled API error", error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
