import { assistantId } from "@/app/assistant-config";
import OpenAI from "openai";

export const openai = new OpenAI();

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  const { content } = await request.json();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  let run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });

  let messages = [];

  // Check if the run is completed
  if (run.status === "completed") {
    const response = await openai.beta.threads.messages.list(run.thread_id);
    messages = response.data.reverse().map((message) => ({
      role: message.role,
      content: message.content[0].text.value,
    }));
  } else {
    console.log(run.status);
    return new Response(JSON.stringify({ status: run.status }), {
      status: 200,
    });
  }

  // Return messages to the frontend
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
