import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todas las listas
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM lists;`;
    return NextResponse.json({ lists: rows });
  } catch (err) {
    console.error("Error fetching lists:", err);
    return NextResponse.json({ error: "Error fetching lists" }, { status: 500 });
  }
}

// Crear lista
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, description, duration } = body;

    const { rows } = await sql`
      INSERT INTO lists (user_id, title, description, duration, created_at)
      VALUES (${userId}, ${title}, ${description}, ${duration}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, list: rows[0] });
  } catch (err) {
    console.error("Error creating list:", err);
    return NextResponse.json({ error: "Error creating list" }, { status: 500 });
  }
}
