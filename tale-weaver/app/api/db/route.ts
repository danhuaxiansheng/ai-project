import { NextRequest, NextResponse } from "next/server";
import { database } from "@/services/db";
import { memorySystem } from "@/services/memory";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");
  const query = searchParams.get("query");

  try {
    if (typeof window === "undefined") {
      return NextResponse.json({ stories: [] });
    }

    switch (action) {
      case "getStories": {
        const stories = await database.getStories();
        return NextResponse.json({ stories: stories || [] });
      }

      case "getStorySessions": {
        if (!id) throw new Error("缺少故事 ID");
        const sessions = await database.getStorySessions(id);
        return NextResponse.json(sessions);
      }

      case "getSessionMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const messages = await database.getSessionMessages(id);
        return NextResponse.json(messages);
      }

      case "getStoryWithSessions": {
        if (!id) throw new Error("缺少故事 ID");
        const data = await database.getStoryWithSessions(id);
        return NextResponse.json(data);
      }

      case "getSessionWithMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const data = await database.getSessionWithMessages(id);
        return NextResponse.json(data);
      }

      case "getContext": {
        if (!id || !query) throw new Error("缺少必要参数");
        const context = await memorySystem.getRelevantContext(query, id);
        return NextResponse.json(context);
      }

      case "getNovelSettings": {
        if (!id) throw new Error("缺少小说 ID");
        const settings = await database.getNovelSettings(id);
        return NextResponse.json(settings);
      }

      case "getChapters": {
        if (!id) throw new Error("缺少小说 ID");
        const chapters = await database.getChapters(id);
        return NextResponse.json(chapters);
      }

      default:
        return NextResponse.json({ error: "无效的操作" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("API 错误:", error);
    return NextResponse.json(
      { error: error.message, stories: [] },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case "createStory": {
        await database.createStory(data);
        return NextResponse.json({ success: true });
      }

      case "createSession": {
        await database.createSession(data);
        return NextResponse.json({ success: true });
      }

      case "addMessage": {
        await database.addMessage(data);
        return NextResponse.json({ success: true });
      }

      case "saveStory": {
        await database.saveStory(data);
        return NextResponse.json({ success: true });
      }

      case "updateNovelSettings": {
        const { novelId, settings } = data;
        const result = await database.updateNovelSettings(novelId, settings);
        return NextResponse.json(result);
      }

      case "rollbackSetting": {
        const { settingId, version } = data;
        const result = await database.rollbackSetting(settingId, version);
        return NextResponse.json(result);
      }

      case "updateSettingTags": {
        const { settingId, tags } = data;
        const result = await database.updateSettingTags(settingId, tags);
        return NextResponse.json(result);
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
