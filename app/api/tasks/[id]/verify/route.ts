// app/api/tasks/[id]/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ajusta path si tu proyecto lo requiere

const NEYNAR_BASE = process.env.NEYNAR_BASE_URL ?? 'https://api.neynar.com/v2/farcaster';
const NEYNAR_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_KEY) {
  console.warn('NEYNAR_API_KEY no definido — la verificación fallará si se requiere Neynar');
}

type VerifyBody = {
  actorFid: number;     // quien afirma haber completado la acción (el visitante)
  taskType: 'follow' | 'recast' | 'reply' | 'keyword';
  target: string;       // dependiendo tipo: target fid (follow), castHash (recast), keyword text (keyword)
};

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body: VerifyBody = await req.json();

    if (!body || !body.actorFid || !body.taskType || !body.target) {
      return NextResponse.json({ ok: false, error: 'Missing actorFid / taskType / target' }, { status: 400 });
    }

    // Fetch the Task from DB (optional validation)
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ ok: false, error: 'Task not found' }, { status: 404 });
    }

    // Decide test by taskType
    let verified = false;
    let reason = '';

    if (!NEYNAR_KEY) {
      // Modo "simulado" si no hay API key: devuelve falso con mensaje.
      reason = 'Neynar API key not configured - verification cannot run';
      return NextResponse.json({ ok: true, verified: false, reason });
    }

    const headers = {
      'x-api-key': NEYNAR_KEY,
      'Content-Type': 'application/json'
    };

    // 1) follow: check if actorFid follows targetFid
    if (body.taskType === 'follow') {
      // target is expected to be a numeric fid (string form)
      const targetFid = Number(body.target);
      if (Number.isNaN(targetFid)) {
        return NextResponse.json({ ok: false, error: 'Invalid target fid for follow' }, { status: 400 });
      }

      // According to Neynar docs: GET /v2/farcaster/user?fid=<target>&viewer_fid=<actor>
      // The returned user.viewer_context.following will tell whether viewer (actor) follows the target user.
      const url = `${NEYNAR_BASE}/user?fid=${targetFid}&viewer_fid=${body.actorFid}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        // safe access
        verified = !!(data?.user?.viewer_context?.following);
        reason = verified ? 'actor follows target' : 'actor does not follow target';
      }
    }

    // 2) recast: check whether actor has recast the target cast
    else if (body.taskType === 'recast') {
      // body.target expected cast hash
      const castHash = body.target;
      // Neynar has reactions endpoints — query reactions by fid + cast_hash
      const url = `${NEYNAR_BASE}/reactions?fid=${body.actorFid}&cast_hash=${encodeURIComponent(castHash)}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        // look for reaction type 'recast' or appropriate flag
        // Structure may vary; this is a best-effort
        const reactions = data?.reactions ?? data?.items ?? [];
        verified = Array.isArray(reactions) && reactions.some((r: any) => r?.type === 'recast' || r?.reaction === 'recast');
        reason = verified ? 'recast found' : 'no recast found';
      }
    }

    // 3) keyword: check actor's recent casts for keyword
    else if (body.taskType === 'keyword') {
      const keyword = body.target.toLowerCase();
      // Neynar feed endpoint: POST/GET feed by fid
      // We'll fetch the actor's feed and scan text for keyword.
      const url = `${NEYNAR_BASE}/feed?fid=${body.actorFid}&limit=50`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const casts = data?.casts ?? data?.items ?? data?.feed ?? [];
        verified = Array.isArray(casts) && casts.some((c: any) => {
          const text = (c?.text ?? c?.body ?? '').toString().toLowerCase();
          return text.includes(keyword);
        });
        reason = verified ? 'keyword present in recent cast' : 'keyword not found';
      }
    }

    // 4) reply: check reply to a specific cast (target = parent cast hash)
    else if (body.taskType === 'reply') {
      const parentHash = body.target;
      // fetch actor's recent casts and see if any has parent_hash == parentHash
      const url = `${NEYNAR_BASE}/feed?fid=${body.actorFid}&limit=50`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        reason = `Neynar returned ${res.status}`;
      } else {
        const data = await res.json();
        const casts = data?.casts ?? data?.items ?? [];
        verified = Array.isArray(casts) && casts.some((c: any) => {
          return (c?.parent_hash === parentHash) || (c?.parent?.hash === parentHash);
        });
        reason = verified ? 'reply found' : 'reply not found';
      }
    }

    // If verified, update DB: mark participation / increase score (minimal example)
    if (verified) {
      // Attempt to find participation and increment score
      // NOTE: This is example logic. You may want to guard double-awarding.
      // Here we record one completion event by creating or updating Participation row.
      const list = await prisma.list.findUnique({ where: { id: task.listId } });
      if (list) {
        // find or create participant
        let participant = await prisma.participation.findFirst({
          where: { user: { fid: body.actorFid }, listId: list.id },
          include: { user: true }
        });

        // find user by fid or create minimal user record
        let user = await prisma.user.findUnique({ where: { fid: body.actorFid } as any });
        if (!user) {
          user = await prisma.user.create({
            data: {
              fid: body.actorFid,
              username: `fid-${body.actorFid}`
            }
          });
        }

        if (!participant) {
          participant = await prisma.participation.create({
            data: {
              userId: user.id,
              listId: list.id,
              score: task.points ?? 0
            }
          });
        } else {
          participant = await prisma.participation.update({
            where: { id: participant.id },
            data: { score: participant.score + (task.points ?? 0) }
          });
        }

        // update global user points
        await prisma.user.update({
          where: { id: user.id },
          data: { points: { increment: task.points ?? 0 } }
        });

        // Emit push via Pusher (opcional) - Si configuras PUSHER envs
        try {
          const Pusher = require('pusher');
          if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
            const p = new Pusher({
              appId: process.env.PUSHER_APP_ID,
              key: process.env.PUSHER_KEY,
              secret: process.env.PUSHER_SECRET,
              cluster: process.env.PUSHER_CLUSTER,
              useTLS: true
            });
            // emitir actualizacion de ranking de la lista
            p.trigger(`list-${list.id}`, 'ranking-updated', { listId: list.id });
            // emitir para ranking global
            p.trigger(`global-ranking`, 'global-ranking-updated', { userId: user.id });
          }
        } catch (err) {
          // ignore pusher runtime errors (no crash)
          console.warn('Pusher emit failed', err);
        }
      }
    }

    return NextResponse.json({ ok: true, verified, reason });
  } catch (error) {
    console.error('Error in verify route', error);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
