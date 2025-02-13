import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 这里应该是保存到数据库的逻辑
    // 现在只是模拟成功响应
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content API Error:", error);
    return NextResponse.json(
      { success: false, message: "保存失败" },
      { status: 500 }
    );
  }
}
