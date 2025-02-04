import { NextResponse } from "next/server";
import type { RoleAdjustment } from "@/types/role";

export async function POST(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const adjustment: RoleAdjustment = await request.json();
    // TODO: 实现调整角色参数的逻辑
    return NextResponse.json({ success: true, roleId: params.roleId });
  } catch (error) {
    console.error("Role adjustment error:", error);
    return NextResponse.json(
      { error: "Failed to adjust role" },
      { status: 500 }
    );
  }
}
