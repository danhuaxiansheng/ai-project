import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  try {
    debugger;
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
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
