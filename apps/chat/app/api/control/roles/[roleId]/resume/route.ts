import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    // TODO: 实现恢复角色的逻辑
    return NextResponse.json({ success: true, roleId: params.roleId });
  } catch (error) {
    console.error("Resume role error:", error);
    return NextResponse.json(
      { error: "Failed to resume role" },
      { status: 500 }
    );
  }
}
