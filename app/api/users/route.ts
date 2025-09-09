import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todos los usuarios
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM users;`;
    return NextResponse.json({ users: rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// Crear usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { farcasterId, name } = body;

    const { rows } = await sql`
      INSERT INTO users (farcaster_id, name, created_at)
      VALUES (${farcasterId}, ${name}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
