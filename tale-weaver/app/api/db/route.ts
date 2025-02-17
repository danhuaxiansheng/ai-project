import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/db";
import { memorySystem } from "@/services/memory";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");
  const query = searchParams.get("query");

  try {
    switch (action) {
      case "getStories": {
        const stories = await db.getStories();
        return NextResponse.json(stories);
      }

      case "getStorySessions": {
        if (!id) throw new Error("缺少故事 ID");
        const sessions = await db.getStorySessions(id);
        return NextResponse.json(sessions);
      }

      case "getSessionMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const messages = await db.getSessionMessages(id);
        return NextResponse.json(messages);
      }

      case "getStoryWithSessions": {
        if (!id) throw new Error("缺少故事 ID");
        const data = await db.getStoryWithSessions(id);
        return NextResponse.json(data);
      }

      case "getSessionWithMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const data = await db.getSessionWithMessages(id);
        return NextResponse.json(data);
      }

      case "getContext": {
        if (!id || !query) throw new Error("缺少必要参数");
        const context = await memorySystem.getRelevantContext(query, id);
        return NextResponse.json(context);
      }

      default:
        return NextResponse.json({ error: "无效的操作" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("API 错误:", error);
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case "createStory": {
        await db.createStory(data);
        return NextResponse.json({ success: true });
      }

      case "createSession": {
        await db.createSession(data);
        return NextResponse.json({ success: true });
      }

      case "addMessage": {
        await db.addMessage(data);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "无效的操作" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("API 错误:", error);
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
