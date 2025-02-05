import { NextResponse } from "next/server";

let tasks = []; // 用于存储任务的数组

export async function GET(request: Request) {
  // 获取所有任务
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  // 创建新任务
  const body = await request.json();
  const newTask = { id: tasks.length + 1, ...body }; // 生成新任务 ID
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  // 更新任务
  const { id, ...updatedData } = await request.json();
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
  return NextResponse.json(tasks[taskIndex]);
}

export async function DELETE(request: Request) {
  // 删除任务
  const { id } = await request.json();
  tasks = tasks.filter((task) => task.id !== id);
  return NextResponse.json({ message: "Task deleted" });
}
