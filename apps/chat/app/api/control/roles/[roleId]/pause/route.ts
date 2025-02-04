import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    // TODO: 实现暂停角色的逻辑
    return NextResponse.json({ success: true, roleId: params.roleId });
  } catch (error) {
    console.error("Pause role error:", error);
    return NextResponse.json(
      { error: "Failed to pause role" },
      { status: 500 }
    );
  }
}
