export const formatTypes = [
  "Documentário narrado", "Storytelling", "Avatar / apresentador", "Animação explicativa", "Lista / ranking",
  "História real", "Nostalgia", "Comparativo", "Tutorial contextual", "Mini-documentário", "Estudo de caso",
  "Linha do tempo", "Mito vs. fato", "Mistério investigativo", "Diário de campo", "Entrevista contextual",
  "Mapa narrado", "Antes e depois", "Perguntas da comunidade", "Série em episódios",
];

const replacements = {
  "Estados Unidos": { community: ["small-town Americans", "retired Americans", "immigrant families"], generation: ["Baby Boomers", "Gen X", "older Americans"], place: ["small towns", "historic neighborhoods"] },
  "Canadá": { community: ["rural Canadians", "immigrant families", "older Canadians"], generation: ["Baby Boomers", "Gen X", "Canadian seniors"], place: ["small Canadian towns", "historic communities"] },
  "Brasil": { community: ["famílias do interior", "aposentados brasileiros", "comunidades tradicionais"], generation: ["geração dos anos 60", "geração dos anos 70", "brasileiros 55+"], place: ["cidades pequenas", "bairros históricos"] },
  "Japão": { community: ["famílias tradicionais", "idosos japoneses", "comunidades rurais"], generation: ["昭和世代", "日本の高齢者", "団塊世代"], place: ["昔の町", "地方の集落"] },
  "Alemanha": { community: ["rural Germans", "older Germans", "local families"], generation: ["Babyboomer", "ältere Generation", "Generation X"], place: ["kleine deutsche Städte", "historische Orte"] },
  "França": { community: ["familles rurales", "Français de 55 ans et plus", "communautés locales"], generation: ["génération des années 60", "seniors français", "génération X"], place: ["villages français", "quartiers historiques"] },
  "Rússia": { community: ["семьи из российских регионов", "старшее поколение", "местные сообщества"], generation: ["поколение 60-х", "старшее поколение", "поколение X"], place: ["старые города", "деревни России"] },
  "Coreia do Sul": { community: ["한국의 어르신", "지역 공동체", "전통 가족"], generation: ["60년대 세대", "시니어 세대", "X세대"], place: ["옛 동네", "전통 마을"] },
  "México": { community: ["familias mexicanas", "adultos mayores", "comunidades locales"], generation: ["generación de los 60", "adultos mayores", "Generación X"], place: ["pueblos mexicanos", "barrios históricos"] },
  "Reino Unido": { community: ["older Britons", "rural families", "local communities"], generation: ["Baby Boomers", "older generation", "Gen X"], place: ["old British towns", "historic villages"] },
};

const localeLanguages = {
  "pt-BR": "Português", en: "English", es: "Español", fr: "Français",
  de: "Deutsch", ja: "日本語", ru: "Русский", ko: "한국어",
};

const localizedPlaceholders = {
  "pt-BR": { community: ["famílias locais", "moradores mais velhos", "comunidades regionais"], generation: ["geração dos anos 60", "geração dos anos 70", "geração atual"], place: ["cidades pequenas", "bairros históricos"] },
  en: { community: ["local families", "older residents", "regional communities"], generation: ["Baby Boomers", "Gen X", "older generations"], place: ["small towns", "historic neighborhoods"] },
  es: { community: ["familias locales", "personas mayores", "comunidades regionales"], generation: ["generación de los 60", "generación X", "generaciones mayores"], place: ["pueblos pequeños", "barrios históricos"] },
  fr: { community: ["familles locales", "habitants âgés", "communautés régionales"], generation: ["génération des années 60", "génération X", "générations plus âgées"], place: ["petites villes", "quartiers historiques"] },
  de: { community: ["Familien vor Ort", "ältere Einwohner", "regionale Gemeinschaften"], generation: ["Babyboomer", "Generation X", "ältere Generationen"], place: ["kleine Städte", "historische Viertel"] },
  ja: { community: ["地域の家族", "年配の住民", "地域コミュニティ"], generation: ["1960年代生まれ", "団塊世代", "年配の世代"], place: ["地方の町", "歴史ある街並み"] },
  ru: { community: ["местные семьи", "пожилые жители", "региональные сообщества"], generation: ["поколение 60-х", "поколение X", "старшее поколение"], place: ["малые города", "исторические районы"] },
  ko: { community: ["지역 가족", "고령 주민", "지역 공동체"], generation: ["1960년대 세대", "X세대", "이전 세대"], place: ["소도시", "역사적인 동네"] },
};

const templates = {
  English: ["The forgotten story of {topic} in {place}", "Why {community} still remember {topic}", "How {topic} changed life in {place}", "What {generation} know about {topic} that others don't", "The tradition of {topic} that almost disappeared", "Inside {place}: a story few people know", "7 details about {topic} only locals recognize", "Before modern life: how {community} lived", "The real reason {topic} matters to {community}", "A look back at {topic} through {generation}'s eyes"],
  Português: ["A história esquecida de {topic} em {place}", "Por que {community} ainda lembram de {topic}", "Como {topic} mudou a vida em {place}", "O que {generation} sabem sobre {topic} que poucos conhecem", "A tradição de {topic} que quase desapareceu", "Dentro de {place}: uma história que poucos conhecem", "7 detalhes de {topic} que só moradores reconhecem", "Antes da vida moderna: como {community} viviam", "O verdadeiro motivo de {topic} ser importante para {community}", "Uma viagem por {topic} na memória de {generation}"],
  日本語: ["{place}に残る{topic}の忘れられた物語", "なぜ{community}は今も{topic}を覚えているのか", "{topic}が{place}の暮らしをどう変えたのか", "{generation}だけが知っている{topic}の記憶", "消えかけた{topic}の伝統", "{place}の知られざる物語", "地元の人だけが知る{topic}の7つのこと", "昔の暮らし：{community}はどう生活していたのか", "{community}にとって{topic}が大切な理由", "{generation}の記憶で振り返る{topic}"],
  Deutsch: ["Die vergessene Geschichte von {topic} in {place}", "Warum {community} sich noch an {topic} erinnern", "Wie {topic} das Leben in {place} verändert hat", "Was {generation} über {topic} wissen, das kaum jemand kennt", "Die Tradition von {topic}, die fast verschwunden ist", "Ein Blick in {place}: eine Geschichte, die kaum jemand kennt", "7 Dinge über {topic}, die nur Einheimische kennen", "Vor dem modernen Leben: Wie {community} lebten", "Warum {topic} für {community} so wichtig ist", "{topic} aus der Erinnerung von {generation}"],
  Français: ["L'histoire oubliée de {topic} à {place}", "Pourquoi {community} se souviennent encore de {topic}", "Comment {topic} a changé la vie à {place}", "Ce que {generation} savent sur {topic} et que peu connaissent", "La tradition de {topic} qui a failli disparaître", "Au cœur de {place} : une histoire méconnue", "7 détails sur {topic} que seuls les habitants connaissent", "Avant la vie moderne : comment {community} vivaient", "Pourquoi {topic} compte tant pour {community}", "{topic} à travers les souvenirs de {generation}"],
  Русский: ["Забытая история {topic} в {place}", "Почему {community} до сих пор помнят {topic}", "Как {topic} изменил жизнь в {place}", "Что {generation} знают о {topic}, чего не знают другие", "Традиция {topic}, которая почти исчезла", "История {place}, о которой мало кто знает", "7 деталей о {topic}, знакомых только местным", "До современной жизни: как жили {community}", "Почему {topic} так важен для {community}", "{topic} глазами и памятью {generation}"],
  한국어: ["{place}에 남아 있는 {topic}의 잊힌 이야기", "왜 {community}는 아직도 {topic}을 기억할까", "{topic}은 {place}의 삶을 어떻게 바꾸었을까", "{generation}만 아는 {topic}의 기억", "사라질 뻔한 {topic}의 전통", "{place}에서 잘 알려지지 않은 이야기", "지역 사람만 아는 {topic}의 7가지 사실", "현대화 이전, {community}의 생활", "{community}에게 {topic}이 특별한 이유", "{generation}의 기억으로 돌아보는 {topic}"],
  Español: ["La historia olvidada de {topic} en {place}", "Por qué {community} todavía recuerdan {topic}", "Cómo {topic} cambió la vida en {place}", "Lo que {generation} saben de {topic} y pocos conocen", "La tradición de {topic} que casi desapareció", "Dentro de {place}: una historia poco conocida", "7 detalles de {topic} que solo los locales reconocen", "Antes de la vida moderna: cómo vivía {community}", "Por qué {topic} es tan importante para {community}", "{topic} a través de los recuerdos de {generation}"],
};

const summaryTemplates = {
  English: (format, audience) => `A ${format.toLowerCase()} for ${audience}: open with a concrete scene or question, add verified context and sources, develop 3–5 original points, and close with a meaningful takeaway. Treat this as an editorial hypothesis—not a proven viral title.`,
  Português: (format, audience) => `Um vídeo em formato ${format.toLowerCase()} para ${audience}: abrir com cena ou pergunta concreta, trazer contexto e fontes verificáveis, desenvolver 3–5 pontos originais e concluir com uma reflexão. Hipótese editorial, não promessa de viralização.`,
  日本語: (format, audience) => `${audience}向けの${format}。具体的な場面や問いから始め、確認できる資料と背景を示し、独自の3〜5点を展開して考察で締めくくる企画案。成果を保証するものではありません。`,
  Deutsch: (format, audience) => `Ein ${format}-Video für ${audience}: mit einer konkreten Szene oder Frage beginnen, geprüfte Quellen und Kontext ergänzen, 3–5 eigene Punkte entwickeln und mit einem Fazit schließen. Eine redaktionelle Hypothese, keine Erfolgsgarantie.`,
  Français: (format, audience) => `Une vidéo au format ${format} pour ${audience} : commencer par une scène ou une question concrète, apporter contexte et sources vérifiées, développer 3 à 5 points originaux et conclure. Hypothèse éditoriale, sans garantie de performance.`,
  Русский: (format, audience) => `Видео в формате «${format}» для ${audience}: начать с конкретной сцены или вопроса, добавить проверенный контекст и источники, раскрыть 3–5 оригинальных тезисов и завершить выводом. Это редакционная гипотеза, а не гарантия просмотров.`,
  한국어: (format, audience) => `${audience}을 위한 ${format} 영상 기획: 구체적인 장면이나 질문으로 시작하고 검증된 자료와 맥락을 더한 뒤 독창적인 3~5개 포인트를 전개하고 의미 있는 결론으로 마무리합니다. 성과를 보장하지 않는 콘텐츠 가설입니다.`,
  Español: (format, audience) => `Un video de ${format} para ${audience}: comenzar con una escena o pregunta concreta, aportar contexto y fuentes verificadas, desarrollar 3–5 puntos originales y cerrar con una conclusión. Es una hipótesis editorial, no una garantía de resultados.`,
};

function getAudienceLanguage(country) {
  const countryLanguage = {
    "Estados Unidos": "English", Canadá: "English", Brasil: "Português", Japão: "日本語",
    Alemanha: "Deutsch", França: "Français", Rússia: "Русский", "Coreia do Sul": "한국어",
    México: "Español", "Reino Unido": "English",
  };
  return countryLanguage[country] || "English";
}

export function buildTitles(audience, format, count = 50, locale) {
  const language = localeLanguages[locale] || getAudienceLanguage(audience.country);
  const topic = audience.topic || audience.tags?.[0] || "local stories";
  const audienceName = audience.label;
  const region = (locale && localizedPlaceholders[locale])
    || replacements[audience.country]
    || replacements["Estados Unidos"];
  const languageTemplates = templates[language] || templates.English;
  const summary = summaryTemplates[language] || summaryTemplates.English;

  return Array.from({ length: count }, (_, index) => {
    const raw = languageTemplates[index % languageTemplates.length];
    const title = raw
      .replaceAll("{topic}", topic)
      .replaceAll("{place}", region.place[index % region.place.length])
      .replaceAll("{community}", region.community[index % region.community.length])
      .replaceAll("{generation}", region.generation[index % region.generation.length]);
    return {
      title,
      summary: summary(format, audienceName),
      angle: `Angle ${index + 1}`,
      format,
      language,
    };
  });
}
