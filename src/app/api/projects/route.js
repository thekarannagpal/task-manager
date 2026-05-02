import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let projects;
    if (session.user.role === "ADMIN") {
      projects = await Project.find().populate("ownerId", "name email").populate("members", "name email");
    } else {
      projects = await Project.find({
        $or: [{ ownerId: session.user.id }, { members: session.user.id }],
      }).populate("ownerId", "name email").populate("members", "name email");
    }

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching projects", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: Only admins can create projects" }, { status: 403 });
    }

    const { name, description, members } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Project name is required" }, { status: 400 });
    }

    await connectToDatabase();

    const newProject = new Project({
      name,
      description,
      ownerId: session.user.id,
      members: members || [],
    });

    await newProject.save();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating project", error: error.message }, { status: 500 });
  }
}
