import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    // TODO: 实现回滚任务的逻辑
    return NextResponse.json({ success: true, taskId: params.taskId });
  } catch (error) {
    console.error("Task rollback error:", error);
    return NextResponse.json(
      { error: "Failed to rollback task" },
      { status: 500 }
    );
  }
}
