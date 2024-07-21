import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = await req.json();
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: message.substring(0, Math.min(message.length, 1000)),
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
    n: 1,
  });
  return new Response(JSON.stringify(response.data[0].b64_json));
}
