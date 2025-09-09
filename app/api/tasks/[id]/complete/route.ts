import { NextResponse } from 'next/server';
import sql from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userFid, attemptData } = await req.json();

  try {
    const taskRes = await sql`SELECT list_id, points FROM tasks WHERE id = ${id}`;
    if (taskRes.rowCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    const listId = taskRes.rows[0].list_id;

    await sql`
      INSERT INTO task_completions (task_id, list_id, user_fid, attempt_data)
      VALUES (${id}, ${listId}, ${userFid}, ${JSON.stringify(attemptData || {})})
      ON CONFLICT (task_id, user_fid) DO NOTHING;
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
