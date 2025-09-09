import { NextResponse } from 'next/server';
import sql from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const listRes = await sql`SELECT * FROM task_lists WHERE id = ${id}`;
    const tasksRes = await sql`SELECT * FROM tasks WHERE list_id = ${id} ORDER BY position ASC`;

    if (listRes.rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ...listRes.rows[0], tasks: tasksRes.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
