import { prisma } from "../../../../lib/prisma";
import { createClient } from "../../../../../utils/supabase/server";

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const parameter = await params;
    const id = parseInt(parameter.id);
    const deletedTask = await prisma.task.delete({
      where: { id, userId: user.id },
    });
    return Response.json(deletedTask);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parameter = await params;
    const id = parseInt(parameter.id);
    const { completed } = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id, userId: user.id },
      data: { completed },
    });
    return Response.json(updatedTask);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
