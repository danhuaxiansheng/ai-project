import { NextRequest, NextResponse } from "next/server";
import { database } from "@/services/db";
import { memorySystem } from "@/services/memory";

// 添加缓存控制的响应头
const cacheHeaders = {
  "Cache-Control": "private, max-age=0, must-revalidate",
  Vary: "Cookie",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    const query = searchParams.get("query");

    switch (action) {
      case "getStories": {
        const stories = await database.getStories();
        return NextResponse.json(
          { stories: stories || [] },
          { headers: cacheHeaders }
        );
      }

      case "getStorySessions": {
        debugger;
        if (!id) throw new Error("缺少故事 ID");
        const sessions = await database.getStorySessions(id);
        return NextResponse.json(sessions, { headers: cacheHeaders });
      }

      case "getSessionMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const messages = await database.getSessionMessages(id);
        return NextResponse.json(messages, { headers: cacheHeaders });
      }

      case "getStoryWithSessions": {
        if (!id) throw new Error("缺少故事 ID");
        const data = await database.getStoryWithSessions(id);
        return NextResponse.json(data, { headers: cacheHeaders });
      }

      case "getSessionWithMessages": {
        if (!id) throw new Error("缺少会话 ID");
        const data = await database.getSessionWithMessages(id);
        return NextResponse.json(data, { headers: cacheHeaders });
      }

      case "getContext": {
        if (!id || !query) throw new Error("缺少必要参数");
        const context = await memorySystem.getRelevantContext(query, id);
        return NextResponse.json(context, { headers: cacheHeaders });
      }

      case "getChapters": {
        if (!id) throw new Error("缺少小说 ID");
        const chapters = await database.getChapters(id);
        return NextResponse.json(chapters, { headers: cacheHeaders });
      }

      default:
        return NextResponse.json(
          { error: "无效的操作" },
          { status: 400, headers: cacheHeaders }
        );
    }
  } catch (error: any) {
    console.error("API 错误:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: cacheHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    // 移除 window 检查
    switch (action) {
      case "createStory": {
        await database.createStory(data);
        return NextResponse.json({ success: true }, { headers: cacheHeaders });
      }

      case "createSession": {
        await database.createSession(data);
        return NextResponse.json({ success: true }, { headers: cacheHeaders });
      }

      case "addMessage": {
        await database.addMessage(data);
        return NextResponse.json({ success: true }, { headers: cacheHeaders });
      }

      case "saveStory": {
        await database.saveStory(data);
        return NextResponse.json({ success: true }, { headers: cacheHeaders });
      }

      case "updateNovelSettings": {
        const { novelId, settings } = data;
        const result = await database.updateNovelSettings(novelId, settings);
        return NextResponse.json(result, { headers: cacheHeaders });
      }

      case "rollbackSetting": {
        const { settingId, version } = data;
        const result = await database.rollbackSetting(settingId, version);
        return NextResponse.json(result, { headers: cacheHeaders });
      }

      case "updateSettingTags": {
        const { settingId, tags } = data;
        const result = await database.updateSettingTags(settingId, tags);
        return NextResponse.json(result, { headers: cacheHeaders });
      }

      default:
        return NextResponse.json(
          { error: "无效的操作" },
          { status: 400, headers: cacheHeaders }
        );
    }
  } catch (error: any) {
    console.error("API 错误:", error);
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500, headers: cacheHeaders }
    );
  }
}
