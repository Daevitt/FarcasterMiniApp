import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Obtener todas las suscripciones
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM subscriptions;`;
    return NextResponse.json({ subscriptions: rows });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return NextResponse.json({ error: "Error fetching subscriptions" }, { status: 500 });
  }
}

// Crear una suscripción
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, plan, status } = body;

    const { rows } = await sql`
      INSERT INTO subscriptions (user_id, plan, status, created_at)
      VALUES (${userId}, ${plan}, ${status}, NOW())
      RETURNING *;
    `;

    return NextResponse.json({ success: true, subscription: rows[0] });
  } catch (err) {
    console.error("Error creating subscription:", err);
    return NextResponse.json({ error: "Error creating subscription" }, { status: 500 });
  }
}
