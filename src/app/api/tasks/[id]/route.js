import { prisma } from "../../../../lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const parameter = await params;
    const id = parseInt(parameter.id);

    const deletedTask = await prisma.task.delete({
      where: { id },
    });
    return Response.json(deletedTask);
  } catch (err) {
    return Response.json({ message: "Failed to delete task" }, { status: 500 });
  }
}
export async function PATCH(req, { params }) {
  try {
    const parameter = await params;
    const id = parseInt(parameter.id);
    const request = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: request.completed,
      },
    });
    return Response.json(updatedTask);
  } catch (err) {
    return Response.json({ message: "Failed to Patch task" }, { status: 500 });
  }
}