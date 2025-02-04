import { NextResponse } from "next/server";

export async function POST() {
  try {
    // TODO: 实现暂停所有角色的逻辑
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pause all error:", error);
    return NextResponse.json(
      { error: "Failed to pause system" },
      { status: 500 }
    );
  }
}
