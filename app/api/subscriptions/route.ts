import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { userFid, status, plan } = body;

    await sql`
      INSERT INTO subscriptions (user_fid, status, plan)
      VALUES (${userFid}, ${status}, ${plan})
      ON CONFLICT (user_fid) DO UPDATE SET
        status = EXCLUDED.status,
        plan = EXCLUDED.plan;
    `;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Error saving subscription" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM subscriptions`;
    return NextResponse.json({ success: true, subs: rows });
  } catch {
    return NextResponse.json({ success: false, error: "Error fetching subs" }, { status: 500 });
  }
}
