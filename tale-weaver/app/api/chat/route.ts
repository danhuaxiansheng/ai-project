import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  try {
    const { role, messages } = await req.json();

    // 构建完整的消息历史，包括系统提示
    const chatMessages = [
      {
        role: "system",
        content: role.systemPrompt,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // 调用 AI API
    const aiResponse = await createChatCompletion(chatMessages);

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
