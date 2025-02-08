import { NextResponse } from "next/server";
import { Role, roles } from "@/types/role";
interface ChatRequest {
  role: Role;
  message: string;
  context?: string;
  projectId?: string;
}

export async function POST(request: Request) {
  try {
    const { role, message, context, projectId } =
      (await request.json()) as ChatRequest;

    // 验证角色
    if (!isValidRole(role)) {
      return NextResponse.json(
        { status: "error", message: "无效的角色" },
        { status: 400 }
      );
    }

    // 调用 DeepSeek API
    const response = await fetch(
      `${process.env.DEEPSEEK_API_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `你现在扮演一个小说创作系统中的${role.name}角色。
            职责：${role.description}
            ${role.systemPrompt || ""}
            请基于以上设定，对用户的输入进行专业的分析和建议。`,
            },
            context && {
              role: "system",
              content: `当前上下文：${context}`,
            },
            {
              role: "user",
              content: message,
            },
          ].filter(Boolean),
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API 错误: ${response.statusText}`);
    }

    const aiResponse = await response.json();

    return NextResponse.json({
      status: "success",
      content: aiResponse.choices[0].message.content,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "AI 服务暂时不可用",
      },
      { status: 500 }
    );
  }
}

// 验证角色是否有效
function isValidRole(role: Role): boolean {
  return roles.some((r) => r.id === role.id);
}
