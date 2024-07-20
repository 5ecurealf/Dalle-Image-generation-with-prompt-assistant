import OpenAI from "openai";

export const openai = new OpenAI();

// Create a new thread
export async function POST() {
  const thread = await openai.beta.threads.create();
  return Response.json({ threadId: thread.id });
}
