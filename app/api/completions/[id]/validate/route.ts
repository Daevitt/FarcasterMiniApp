import { NextResponse } from 'next/server';
import sql from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  const { id } = params;
  const { validatorFid, points } = await req.json();

  try {
    const res = await sql`
      UPDATE task_completions
      SET validated = true, validator_fid = ${validatorFid}, points_awarded = ${points}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Completion not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
