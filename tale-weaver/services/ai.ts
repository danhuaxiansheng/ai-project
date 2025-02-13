import { Role } from "@/types/role";

export async function generateAIResponse(
  role: Role,
  messages: { role: string; content: string }[]
) {
  try {
    // 构建完整的消息历史，包括系统提示
    const chatMessages = [
      {
        role: "system",
        content: `${role.systemPrompt}\n\n你现在是${role.name}。请基于已有的对话内容继续对话。`,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      throw new Error("AI response failed");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}
