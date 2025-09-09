// app/api/tasks/[id]/verify/route.ts
import { NextResponse } from "next/server";
import {
  checkFollow,
  checkRecast,
  checkComment,
  checkCastPhrase,
} from "@/lib/verifier";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { fid, type, target } = await req.json();
  // type = "follow" | "recast" | "comment" | "cast_phrase"
  // target depende del tipo:
  // follow -> targetFid (number)
  // recast/comment -> castHash (string)
  // cast_phrase -> phrase (string)

  let success = false;

  for (let i = 0; i < 6; i++) {
    if (type === "follow") {
      success = await checkFollow(fid, target);
    } else if (type === "recast") {
      success = await checkRecast(fid, target);
    } else if (type === "comment") {
      success = await checkComment(fid, target);
    } else if (type === "cast_phrase") {
      success = await checkCastPhrase(fid, target);
    }

    if (success) break;

    // espera 5s antes del siguiente intento
    await new Promise((res) => setTimeout(res, 5000));
  }

  if (success) {
    // TODO: actualizar DB con éxito y sumar puntos
    return NextResponse.json({ ok: true, verified: true });
  } else {
    return NextResponse.json({ ok: true, verified: false });
  }
}
