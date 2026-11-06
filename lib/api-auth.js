import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export function authorizeApiRequest(request) {
  const expectedKey = process.env.UMBRA_API_KEY;
  if (!expectedKey) {
    return NextResponse.json(
      { error: "API não configurada. Defina UMBRA_API_KEY no ambiente do servidor." },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const providedKey = match?.[1] || "";
  const expected = Buffer.from(expectedKey);
  const provided = Buffer.from(providedKey);
  const valid = expected.length === provided.length && timingSafeEqual(expected, provided);

  if (!valid) {
    return NextResponse.json({ error: "Chave de API ausente ou inválida." }, { status: 401 });
  }

  return null;
}
