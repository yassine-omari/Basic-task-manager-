import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const data = await prisma.task.findMany();
    return Response.json(data);
  } catch (err) {
    console.error("FULL ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const request = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title: request.title,
      },
    });
    return Response.json(newTask);
  } catch (err) {
    return Response.json({ message: "Failed to add task" }, { status: 500 });
  }
}