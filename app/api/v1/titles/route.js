import { NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/api-auth";
import { getAudienceCatalog } from "@/lib/audiences";
import { buildTitles, formatTypes } from "@/lib/title-generator";
import { getAudiencePresentation } from "@/i18n/audiences";
import { UI_LANGUAGES, messages } from "@/i18n/messages";

export async function POST(request) {
  const unauthorized = authorizeApiRequest(request);
  if (unauthorized) return unauthorized;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Envie um corpo JSON válido." }, { status: 400 });
  }

  const { audienceId, format, topic, count = 50, locale = "pt-BR" } = body || {};
  const audience = getAudienceCatalog().find((item) => item.id === audienceId);
  if (!audience) {
    return NextResponse.json({ error: "audienceId deve corresponder a um micropúblico existente." }, { status: 400 });
  }
  if (typeof format !== "string" || !formatTypes.includes(format)) {
    return NextResponse.json({ error: "format deve ser um formato editorial disponível na plataforma." }, { status: 400 });
  }
  if (topic !== undefined && (typeof topic !== "string" || topic.length > 200)) {
    return NextResponse.json({ error: "topic deve ser um texto com até 200 caracteres." }, { status: 400 });
  }
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    return NextResponse.json({ error: "count deve ser um inteiro entre 1 e 50." }, { status: 400 });
  }
  if (!UI_LANGUAGES.some((item) => item.code === locale)) {
    return NextResponse.json({ error: "locale não é um idioma de interface suportado." }, { status: 400 });
  }

  const presentation = getAudiencePresentation(
    audience,
    locale,
    messages[locale].countryNames[audience.country] || audience.country,
  );
  const titles = buildTitles(
    { ...audience, label: presentation.label, topic: topic?.trim() || audience.topic },
    format,
    count,
    locale,
  );

  return NextResponse.json({
    audience: { id: audience.id, label: presentation.label },
    format,
    topic: topic?.trim() || audience.topic,
    count: titles.length,
    locale,
    items: titles,
  });
}
