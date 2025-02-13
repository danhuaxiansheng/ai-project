import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion } from "@/lib/ai-client";

const REVIEW_PROMPT = `
请对以下内容进行质量评估，从三个维度进行打分（0-10分）并给出具体建议：

1. 逻辑一致性：内容是否前后连贯，是否存在矛盾
2. 文风匹配度：是否符合角色特点和故事风格
3. 观赏度：是否引人入胜，是否有趣生动

请以以下JSON格式返回评估结果：
{
  "metrics": {
    "logicConsistency": number,
    "styleMatching": number,
    "engagement": number
  },
  "suggestions": string[],
  "overallScore": number
}
`;

export async function POST(req: NextRequest) {
  try {
    const { content, role, context } = await req.json();

    const messages = [
      {
        role: "system",
        content: REVIEW_PROMPT,
      },
      {
        role: "user",
        content: `
角色：${role.name}
上下文：${context}
待评估内容：${content}
        `,
      },
    ];

    const response = await createChatCompletion(messages);
    const result = JSON.parse(response.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "Failed to review content" },
      { status: 500 }
    );
  }
}
