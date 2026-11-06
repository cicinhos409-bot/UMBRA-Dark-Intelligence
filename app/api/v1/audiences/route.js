import { NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/api-auth";
import { getAudienceCatalog } from "@/lib/audiences";
import { getAudiencePresentation } from "@/i18n/audiences";
import { UI_LANGUAGES, messages } from "@/i18n/messages";

export function GET(request) {
  const unauthorized = authorizeApiRequest(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLocaleLowerCase();
  const country = searchParams.get("country");
  const language = searchParams.get("language");
  const locale = UI_LANGUAGES.some((item) => item.code === searchParams.get("locale"))
    ? searchParams.get("locale")
    : "pt-BR";
  const limitValue = Number(searchParams.get("limit") || 50);
  if (!Number.isInteger(limitValue) || limitValue < 1 || limitValue > 322) {
    return NextResponse.json({ error: "limit deve ser um inteiro entre 1 e 322." }, { status: 400 });
  }

  const countryNames = messages[locale].countryNames;
  const items = getAudienceCatalog().flatMap((audience) => {
    if (country && country !== "Todos" && country !== audience.country) return [];
    if (language && language !== "Todos" && language !== audience.language) return [];

    const presentation = getAudiencePresentation(
      audience,
      locale,
      countryNames[audience.country] || audience.country,
    );
    const result = {
      id: audience.id,
      country: presentation.country,
      language: presentation.language,
      flag: audience.flag,
      label: presentation.label,
      perspective: presentation.perspective,
      topic: audience.topic,
      tags: presentation.tags,
      validation: audience.validation,
    };
    const searchable = `${result.label} ${result.perspective} ${result.topic} ${result.tags.join(" ")}`.toLocaleLowerCase();
    return !query || searchable.includes(query) ? [result] : [];
  });

  return NextResponse.json({ total: items.length, items: items.slice(0, limitValue), locale });
}
