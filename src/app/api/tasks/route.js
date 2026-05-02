import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let tasks;
    if (session.user.role === "ADMIN") {
      tasks = await Task.find().populate("projectId", "name").populate("assigneeId", "name email");
    } else {
      const userProjects = await Project.find({
        $or: [{ ownerId: session.user.id }, { members: session.user.id }]
      }).select("_id");
      
      const projectIds = userProjects.map(p => p._id);
      
      tasks = await Task.find({
        $or: [
          { assigneeId: session.user.id },
          { projectId: { $in: projectIds } }
        ]
      }).populate("projectId", "name").populate("assigneeId", "name email");
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching tasks", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, status, dueDate, projectId, assigneeId } = await req.json();

    if (!title || !projectId) {
      return NextResponse.json({ message: "Title and Project ID are required" }, { status: 400 });
    }

    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const isMember = project.members.includes(session.user.id) || project.ownerId.toString() === session.user.id;
    if (session.user.role !== "ADMIN" && !isMember) {
        return NextResponse.json({ message: "Forbidden: You are not a member of this project" }, { status: 403 });
    }

    const newTask = new Task({
      title,
      description,
      status: status || "TODO",
      dueDate,
      projectId,
      assigneeId,
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating task", error: error.message }, { status: 500 });
  }
}
