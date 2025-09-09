import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, context: { params: { id: string } }) { 
  const { id } = context.params as { id: string };

  try {
    const body = await req.json();
    const { userFid, pointsAwarded } = body;

    await sql`
      INSERT INTO completions (list_id, user_fid, points_awarded)
      VALUES (${id}, ${userFid}, ${pointsAwarded})
      ON CONFLICT (list_id, user_fid) DO UPDATE SET
        points_awarded = EXCLUDED.points_awarded;
    `;

    return NextResponse.json({ success: true, listId: id, userFid });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Error validating completion" }, { status: 500 });
  }
}
