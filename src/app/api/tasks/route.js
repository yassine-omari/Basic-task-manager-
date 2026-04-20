import { prisma } from "../../../lib/prisma";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(data);
  } catch (err) {
    console.error("GET ERROR:", err); // add this
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title,
        userId: user.id,
      },
    });
    return Response.json(newTask);
  } catch (err) {
    console.error("GET ERROR:", err); // add this
    return Response.json({ error: err.message }, { status: 500 });
  }
}
