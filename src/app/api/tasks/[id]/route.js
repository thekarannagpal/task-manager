import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { status, assigneeId, title, description, dueDate } = await req.json();

    await connectToDatabase();

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (status) task.status = status;
    if (assigneeId !== undefined) task.assigneeId = assigneeId;
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating task", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const { id } = params;
        await connectToDatabase();
        
        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        
        await Task.findByIdAndDelete(id);
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting task", error: error.message }, { status: 500 });
    }
}
