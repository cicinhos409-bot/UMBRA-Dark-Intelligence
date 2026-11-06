import baseAudiences from "../data/micropublicos.json";
import additionalAudienceTopics from "../data/micropublicos-adicionais.json";

const audienceThemeTags = [
  "história local", "memória comunitária", "patrimônio", "arquitetura", "natureza",
  "conservação", "culinária", "agricultura local", "música", "artes cênicas",
  "ciência", "história industrial", "engenharia", "transporte e navegação", "museus",
  "bibliotecas e arquivos", "fotografia", "literatura", "esportes", "observação da natureza",
];

const audienceLabelFormats = {
  English: (topic) => `${topic} enthusiasts`,
  Português: (topic) => `Público interessado em ${topic}`,
  日本語: (topic) => `${topic}に関心のある人々`,
  Deutsch: (topic) => `Interessierte an ${topic}`,
  Français: (topic) => `Passionnés de ${topic}`,
  Русский: (topic) => `Любители темы «${topic}»`,
  한국어: (topic) => `${topic} 관심층`,
  Español: (topic) => `Aficionados a ${topic}`,
};

export function getAudienceCatalog() {
  const addedAudiences = Object.entries(additionalAudienceTopics).flatMap(([country, topics]) => {
    const base = baseAudiences.find((audience) => audience.country === country);
    if (!base) throw new Error(`Nenhum micropúblico base encontrado para ${country}.`);
    const makeLabel = audienceLabelFormats[base.language];
    if (!makeLabel) throw new Error(`Idioma sem modelo de micropúblico: ${base.language}.`);
    const prefix = base.id.split("-").slice(0, 2).join("-");

    return topics.map((topic, index) => ({
      ...base,
      id: `${prefix}-${String(index + 11).padStart(2, "0")}`,
      label: makeLabel(topic),
      perspective: `Explore ${topic} com fontes verificáveis, contexto local e perspectivas da comunidade, sem tratar hipóteses como fatos.`,
      topic,
      tags: [topic, audienceThemeTags[index] || topic],
    }));
  });

  return [...baseAudiences, ...addedAudiences];
}
