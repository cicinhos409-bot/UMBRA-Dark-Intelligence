 "use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Radar, LayoutDashboard, Users, Layers3, Bookmark, Settings, ChevronLeft, ChevronRight, Youtube, Sparkles, Globe2, TrendingUp, ArrowUpRight, Copy, ExternalLink, Menu, Filter, PlayCircle, Clock3, Target, Zap, Plus, Check, X, BarChart3 } from "lucide-react";
import baseAudiences from "@/data/micropublicos.json";
import additionalAudienceTopics from "@/data/micropublicos-adicionais.json";
import { UI_LANGUAGES, formatDescriptions, localeTags, messages, translate } from "@/i18n/messages";

const audienceThemeTags=["história local","memória comunitária","patrimônio","arquitetura","natureza","conservação","culinária","agricultura local","música","artes cênicas","ciência","história industrial","engenharia","transporte e navegação","museus","bibliotecas e arquivos","fotografia","literatura","esportes","observação da natureza"];
const audienceLabelFormats={
 English:topic=>`${topic} enthusiasts`,
 Português:topic=>`Público interessado em ${topic}`,
 日本語:topic=>`${topic}に関心のある人々`,
 Deutsch:topic=>`Interessierte an ${topic}`,
 Français:topic=>`Passionnés de ${topic}`,
 Русский:topic=>`Любители темы «${topic}»`,
 한국어:topic=>`${topic} 관심층`,
 Español:topic=>`Aficionados a ${topic}`
};
const addedAudiences=Object.entries(additionalAudienceTopics).flatMap(([country,topics])=>{
 const base=baseAudiences.find(a=>a.country===country);
 if(!base)throw new Error(`Nenhum micropúblico base encontrado para ${country}.`);
 const makeLabel=audienceLabelFormats[base.language];
 if(!makeLabel)throw new Error(`Idioma sem modelo de micropúblico: ${base.language}.`);
 const prefix=base.id.split("-").slice(0,2).join("-");
 return topics.map((topic,index)=>({
  ...base,
  id:`${prefix}-${String(index+11).padStart(2,"0")}`,
  label:makeLabel(topic),
  perspective:`Explore ${topic} com fontes verificáveis, contexto local e perspectivas da comunidade, sem tratar hipóteses como fatos.`,
  topic,
  tags:[topic,audienceThemeTags[index]],
 }));
});
const audiences=[...baseAudiences,...addedAudiences];

const countries = ["Todos","Estados Unidos","Canadá","Brasil","Japão","Alemanha","França","Rússia","Coreia do Sul","México","Reino Unido"];
const languages = ["Todos","English","Português","日本語","Deutsch","Français","Русский","한국어","Español"];
const fmt = (n,locale="pt-BR") => Intl.NumberFormat(locale,{notation:n>9999?"compact":"standard",maximumFractionDigits:1}).format(n||0);
const nav = [
  {id:"overview",label:"Visão geral",icon:LayoutDashboard},
  {id:"discover",label:"Descobrir oportunidades",icon:Radar},
  {id:"audiences",label:"Micropúblicos",icon:Users},
  {id:"formats",label:"Transferência de formatos",icon:Layers3},
  {id:"saved",label:"Oportunidades salvas",icon:Bookmark},
];
const formatTypes=["Documentário narrado","Storytelling","Avatar / apresentador","Animação explicativa","Lista / ranking","História real","Nostalgia","Comparativo","Tutorial contextual","Mini-documentário","Estudo de caso","Linha do tempo","Mito vs. fato","Mistério investigativo","Diário de campo","Entrevista contextual","Mapa narrado","Antes e depois","Perguntas da comunidade","Série em episódios"];
const seedIdeas=[
 ["A vida cotidiana que mudou para sempre em [REGIÃO]","Como [COMUNIDADE] preserva uma tradição que quase desapareceu","O que [GERAÇÃO] lembra sobre [ÉPOCA] e poucos contam","Por que [COSTUME] é tão importante para [COMUNIDADE]","A história por trás de [LUGAR] que os moradores nunca esqueceram"],
 ["[TEMA] explicado para quem cresceu em [REGIÃO]","O jeito de [COMUNIDADE] fazer [ATIVIDADE] é diferente por um motivo","7 detalhes de [CULTURA] que só [PÚBLICO] reconhece","Como [MUDANÇA] transformou a vida de [GERAÇÃO]","O que torna [LUGAR] tão especial para [PÚBLICO]"],
 ["Antes e depois de [LUGAR]: o que mudou em [ÉPOCA]","A tradição de [COMUNIDADE] que surpreende quem vem de fora","Por que [OBJETO] marcou uma geração inteira em [REGIÃO]","O segredo de [ATIVIDADE] que [PÚBLICO] aprendeu com os mais velhos","As histórias de [LUGAR] que merecem ser lembradas"]
];
const replacements = {
 "Estados Unidos":{region:["Appalachia","Midwest","New England","Texas rural","Pacific Northwest"],community:["small-town Americans","retired Americans","immigrant families"],generation:["Baby Boomers","Gen X","older Americans"],culture:["American local culture","regional traditions"],place:["small towns","historic neighborhoods"]},
 "Canadá":{region:["Atlantic Canada","Prairies","Northern Ontario","Quebec rural","British Columbia"],community:["rural Canadians","immigrant families","older Canadians"],generation:["Baby Boomers","Gen X","Canadian seniors"],culture:["Canadian traditions","regional life"],place:["small Canadian towns","historic communities"]},
 "Brasil":{region:["interior de Minas","Nordeste rural","Sul do Brasil","Amazônia","interior paulista"],community:["famílias do interior","aposentados brasileiros","comunidades tradicionais"],generation:["geração dos anos 60"," geração dos anos 70","brasileiros 55+"],culture:["cultura regional","tradições brasileiras"],place:["cidades pequenas","bairros históricos"]},
 "Japão":{region:["Tohoku","Shikoku","rural Hokkaido","Osaka antiga","Tokyo de décadas atrás"],community:["famílias tradicionais","idosos japoneses","comunidades rurais"],generation:["昭和世代","日本の高齢者","団塊世代"],culture:["日本の伝統","地域文化"],place:["昔の町","地方の集落"]},
 "Alemanha":{region:["Baviera rural","Saxônia","Rheinland","Schwarzwald","norte da Alemanha"],community:["rural Germans","older Germans","local families"],generation:["Babyboomer","ältere Generation","Generation X"],culture:["deutsche Traditionen","regionale Kultur"],place:["kleine deutsche Städte","historische Orte"]},
 "França":{region:["Bretagne","Normandie","Provence rural","Alsace","Auvergne"],community:["familles rurales","Français de 55 ans et plus","communautés locales"],generation:["génération des années 60","seniors français","génération X"],culture:["traditions françaises","culture régionale"],place:["villages français","quartiers historiques"]},
 "Rússia":{region:["Sibéria","Ural","aldeias do norte","região do Volga","Rússia rural"],community:["famílias russas","idosos russos","comunidades locais"],generation:["поколение 60-х","старшее поколение","поколение X"],culture:["русские традиции","региональная культура"],place:["старые города","деревни России"]},
 "Coreia do Sul":{region:["Jeolla rural","Gangwon","Busan antiga","Gyeongsang","Seoul de décadas atrás"],community:["한국의 어르신","지역 공동체","전통 가족"],generation:["60년대 세대","시니어 세대","X세대"],culture:["한국의 전통","지역 문화"],place:["옛 동네","전통 마을"]},
 "México":{region:["Oaxaca","Yucatán","norte rural","Michoacán","Chiapas"],community:["familias mexicanas","adultos mayores","comunidades locales"],generation:["generación de los 60","adultos mayores","Generación X"],culture:["tradiciones mexicanas","cultura regional"],place:["pueblos mexicanos","barrios históricos"]},
 "Reino Unido":{region:["Yorkshire","Scottish Highlands","Wales rural","Cornwall","Midlands"],community:["older Britons","rural families","local communities"],generation:["Baby Boomers","older generation","Gen X"],culture:["British traditions","regional culture"],place:["old British towns","historic villages"]}
};
const getLang = c=>({"Estados Unidos":"English","Canadá":"English","Brasil":"Português","Japão":"日本語","Alemanha":"Deutsch","França":"Français","Rússia":"Русский","Coreia do Sul":"한국어","México":"Español","Reino Unido":"English"}[c]||"English");
function buildTitles(a,format,count=50){
 const lang=getLang(a.country), topic=a.topic||a.tags?.[0]||"local stories";
 const audienceName=a.label;
 const packs={
 English:[
  "The forgotten story of {topic} in {place}","Why {community} still remember {topic}","How {topic} changed life in {place}","What {generation} know about {topic} that others don't","The tradition of {topic} that almost disappeared","Inside {place}: a story few people know","7 details about {topic} only locals recognize","Before modern life: how {community} lived","The real reason {topic} matters to {community}","A look back at {topic} through {generation}'s eyes"],
 Português:[
  "A história esquecida de {topic} em {place}","Por que {community} ainda lembram de {topic}","Como {topic} mudou a vida em {place}","O que {generation} sabem sobre {topic} que poucos conhecem","A tradição de {topic} que quase desapareceu","Dentro de {place}: uma história que poucos conhecem","7 detalhes de {topic} que só moradores reconhecem","Antes da vida moderna: como {community} viviam","O verdadeiro motivo de {topic} ser importante para {community}","Uma viagem por {topic} na memória de {generation}"],
  日本語:["{place}に残る{topic}の忘れられた物語","なぜ{community}は今も{topic}を覚えているのか","{topic}が{place}の暮らしをどう変えたのか","{generation}だけが知っている{topic}の記憶","消えかけた{topic}の伝統","{place}の知られざる物語","地元の人だけが知る{topic}の7つのこと","昔の暮らし：{community}はどう生活していたのか","{community}にとって{topic}が大切な理由","{generation}の記憶で振り返る{topic}"],
  Deutsch:["Die vergessene Geschichte von {topic} in {place}","Warum {community} sich noch an {topic} erinnern","Wie {topic} das Leben in {place} verändert hat","Was {generation} über {topic} wissen, das kaum jemand kennt","Die Tradition von {topic}, die fast verschwunden ist","Ein Blick in {place}: eine Geschichte, die kaum jemand kennt","7 Dinge über {topic}, die nur Einheimische kennen","Vor dem modernen Leben: Wie {community} lebten","Warum {topic} für {community} so wichtig ist","{topic} aus der Erinnerung von {generation}"],
  Français:["L'histoire oubliée de {topic} à {place}","Pourquoi {community} se souviennent encore de {topic}","Comment {topic} a changé la vie à {place}","Ce que {generation} savent sur {topic} et que peu connaissent","La tradition de {topic} qui a failli disparaître","Au cœur de {place} : une histoire méconnue","7 détails sur {topic} que seuls les habitants connaissent","Avant la vie moderne : comment {community} vivaient","Pourquoi {topic} compte tant pour {community}","{topic} à travers les souvenirs de {generation}"],
  Русский:["Забытая история {topic} в {place}","Почему {community} до сих пор помнят {topic}","Как {topic} изменил жизнь в {place}","Что {generation} знают о {topic}, чего не знают другие","Традиция {topic}, которая почти исчезла","История {place}, о которой мало кто знает","7 деталей о {topic}, знакомых только местным","До современной жизни: как жили {community}","Почему {topic} так важен для {community}","{topic} глазами и памятью {generation}"],
  한국어:["{place}에 남아 있는 {topic}의 잊힌 이야기","왜 {community}는 아직도 {topic}을 기억할까","{topic}은 {place}의 삶을 어떻게 바꾸었을까","{generation}만 아는 {topic}의 기억","사라질 뻔한 {topic}의 전통","{place}에서 잘 알려지지 않은 이야기","지역 사람만 아는 {topic}의 7가지 사실","현대화 이전, {community}의 생활","{community}에게 {topic}이 특별한 이유","{generation}의 기억으로 돌아보는 {topic}"],
  Español:["La historia olvidada de {topic} en {place}","Por qué {community} todavía recuerdan {topic}","Cómo {topic} cambió la vida en {place}","Lo que {generation} saben de {topic} y pocos conocen","La tradición de {topic} que casi desapareció","Dentro de {place}: una historia poco conocida","7 detalles de {topic} que solo los locales reconocen","Antes de la vida moderna: cómo vivía {community}","Por qué {topic} es tan importante para {community}","{topic} a través de los recuerdos de {generation}"]
 };
 const r=replacements[a.country]||replacements["Estados Unidos"];
 const vals={place:r.place,community:r.community,generation:r.generation,topic:[topic,topic,topic,topic,topic]};
 const templates=packs[lang]||packs.English;
 return Array.from({length:count},(_,i)=>{
  const raw=templates[i%templates.length];let title=raw;
  title=title.replaceAll("{topic}",vals.topic[i%vals.topic.length]).replaceAll("{place}",vals.place[i%vals.place.length]).replaceAll("{community}",vals.community[i%vals.community.length]).replaceAll("{generation}",vals.generation[i%vals.generation.length]);
  const summaries={
   English:`A ${format.toLowerCase()} for ${audienceName}: open with a concrete scene or question, add verified context and sources, develop 3–5 original points, and close with a meaningful takeaway. Treat this as an editorial hypothesis—not a proven viral title.`,
   Português:`Um vídeo em formato ${format.toLowerCase()} para ${audienceName}: abrir com cena ou pergunta concreta, trazer contexto e fontes verificáveis, desenvolver 3–5 pontos originais e concluir com uma reflexão. Hipótese editorial, não promessa de viralização.`,
   日本語:`${audienceName}向けの${format}。具体的な場面や問いから始め、確認できる資料と背景を示し、独自の3〜5点を展開して考察で締めくくる企画案。成果を保証するものではありません。`,
   Deutsch:`Ein ${format}-Video für ${audienceName}: mit einer konkreten Szene oder Frage beginnen, geprüfte Quellen und Kontext ergänzen, 3–5 eigene Punkte entwickeln und mit einem Fazit schließen. Eine redaktionelle Hypothese, keine Erfolgsgarantie.`,
   Français:`Une vidéo au format ${format} pour ${audienceName} : commencer par une scène ou une question concrète, apporter contexte et sources vérifiées, développer 3 à 5 points originaux et conclure. Hypothèse éditoriale, sans garantie de performance.`,
   Русский:`Видео в формате «${format}» для ${audienceName}: начать с конкретной сцены или вопроса, добавить проверенный контекст и источники, раскрыть 3–5 оригинальных тезисов и завершить выводом. Это редакционная гипотеза, а не гарантия просмотров.`,
   한국어:`${audienceName}을 위한 ${format} 영상 기획: 구체적인 장면이나 질문으로 시작하고 검증된 자료와 맥락을 더한 뒤 독창적인 3~5개 포인트를 전개하고 의미 있는 결론으로 마무리합니다. 성과를 보장하지 않는 콘텐츠 가설입니다.`,
   Español:`Un video de ${format} para ${audienceName}: comenzar con una escena o pregunta concreta, aportar contexto y fuentes verificadas, desarrollar 3–5 puntos originales y cerrar con una conclusión. Es una hipótesis editorial, no una garantía de resultados.`
  };
  return {title,summary:summaries[lang]||summaries.English,angle:`Angle ${i+1}`,format,language:lang};
 });
}
function scoreVideo(v){const views=Number(v.statistics?.viewCount||0), ageDays=Math.max(1,(Date.now()-new Date(v.snippet?.publishedAt).getTime())/86400000);return Math.round(Math.min(100,Math.log10(views+1)*10+Math.max(0,35-ageDays)*.6));}
function videoDurationSeconds(v){
 const duration=v.contentDetails?.duration;
 if(typeof duration!=="string")return null;
 const match=duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
 return match?Number(match[1]||0)*3600+Number(match[2]||0)*60+Number(match[3]||0):null;
}
export default function Home(){
 const [page,setPage]=useState("overview"),[collapsed,setCollapsed]=useState(false),[mobile,setMobile]=useState(false);
 const [uiLocale,setUiLocale]=useState("pt-BR"),[localeReady,setLocaleReady]=useState(false);
 const [country,setCountry]=useState("Estados Unidos"),[language,setLanguage]=useState("English"),[audience,setAudience]=useState(""),[topic,setTopic]=useState(""),[format,setFormat]=useState(formatTypes[0]),[query,setQuery]=useState(""),[order,setOrder]=useState("viewCount"),[days,setDays]=useState("365"),[videoLength,setVideoLength]=useState("all"),[results,setResults]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState(""),[searched,setSearched]=useState(false),[saved,setSaved]=useState([]),[active,setActive]=useState(null),[titles,setTitles]=useState([]),[titleFilter,setTitleFilter]=useState(""),[tab,setTab]=useState("videos");
 const filteredAudiences=useMemo(()=>{
  const stopWords=new Set(["a","as","o","os","de","da","das","do","dos","em","no","na","nos","nas","por","para","com","que","um","uma","e","eu","quero","queria","estou","pensando","ideias","ideia","criar","fazer","produzir","video","videos","conteudo","sobre","the","and","for","with","from","about","want","make","create","video","videos"]);
  const terms=audience.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/\s+/).filter(term=>term.length>2&&!stopWords.has(term));
  return audiences.filter(a=>{
   const matchesCountry=country==="Todos"||a.country===country;
   const matchesLanguage=language==="Todos"||a.language===language;
   const searchable=`${a.label} ${a.topic} ${a.tags.join(" ")} ${a.perspective}`.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
   return matchesCountry&&matchesLanguage&&(!terms.length||terms.some(term=>searchable.includes(term)));
  });
 },[country,language,audience]);
 const filteredResults=useMemo(()=>results.filter(v=>{if(videoLength==="all")return true;const seconds=videoDurationSeconds(v);return seconds!==null&&(videoLength==="shorts"?seconds<=180:seconds>180)}),[results,videoLength]);
 const current=active||filteredAudiences[0]||audiences[0];
 const m=messages[uiLocale]||messages["pt-BR"];
 const t=(key,values)=>translate(m,key,values);
 const locale=localeTags[uiLocale]||"pt-BR";
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem("udi-saved")||"[]"))}catch{}},[]);
 useEffect(()=>{try{const stored=localStorage.getItem("udi-locale");if(UI_LANGUAGES.some(language=>language.code===stored))setUiLocale(stored)}catch{}finally{setLocaleReady(true)}},[]);
 useEffect(()=>{document.documentElement.lang=locale;if(localeReady)localStorage.setItem("udi-locale",uiLocale)},[uiLocale,locale,localeReady]);
 const save=(a)=>{const next=saved.some(x=>x.id===a.id)?saved.filter(x=>x.id!==a.id):[...saved,a];setSaved(next);localStorage.setItem("udi-saved",JSON.stringify(next));};
 async function searchYT(){
  setLoading(true);setError("");setSearched(true);
  try{const p=new URLSearchParams({q:query||current.label,country:country==="Todos"?(current.country||"US"):country,order,days,maxResults:"50"});
   const res=await fetch("/api/youtube?"+p);const data=await res.json();if(!res.ok)throw new Error(data.error||"Falha na pesquisa");setResults(data.items||[]);}
  catch(e){setError(e.message);setResults([])}finally{setLoading(false)}
 }
 function generate(){const a={...current,topic:topic||current.topic};setTitles(buildTitles(a,format,50));setTab("titles");}
 const go=(id)=>{setPage(id);setMobile(false)};
 const pageTitle=page==="settings"?t("settings.title"):t(`pages.${page}.title`);
 const pageDescription=page==="settings"?t("settings.description"):t(`pages.${page}.description`,{count:audiences.length});
 return <div className="app-shell">
  <aside className={`sidebar ${collapsed?"collapsed":""} ${mobile?"mobile-open":""}`}>
   <div className="brand"><div className="brand-mark"><Radar size={22}/></div>{!collapsed&&<div><b>UMBRA</b><small>DARK INTELLIGENCE</small></div>}<button className="collapse" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<ChevronRight/>:<ChevronLeft/>}</button></div>
   <div className="workspace-label">{!collapsed&&t("workspace")}</div>
   <nav>{nav.map(n=><button key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>go(n.id)} title={t(`nav.${n.id}`)}><n.icon size={19}/>{!collapsed&&<span>{t(`nav.${n.id}`)}</span>}{!collapsed&&n.id==="saved"&&<em>{saved.length}</em>}</button>)}</nav>
   <div className="sidebar-bottom"><button className="nav-item" onClick={()=>go("settings")}><Settings size={19}/>{!collapsed&&t("settings.title")}</button><div className="profile">{!collapsed&&<><div className="avatar">U</div><div><b>Umbra Operator</b><small>{t("profileRole")}</small></div></>}</div></div>
  </aside>
  <div className="main-area">
   <header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(!mobile)}><Menu/></button><div className="crumb">UMBRA <span>/</span> {pageTitle}</div><div className="top-actions"><label className="locale-picker"><span className="sr-only">{t("common.appLanguage")}</span><select aria-label={t("common.appLanguage")} value={uiLocale} onChange={e=>setUiLocale(e.target.value)}>{UI_LANGUAGES.map(item=><option key={item.code} value={item.code}>{item.label}</option>)}</select></label><span className="status-dot"/> <small>{t("workspaceStatus")}</small><div className="top-avatar">U</div></div></header>
   <main className="content">
    <div className="page-heading"><div><div className="eyebrow"><span className="pulse"/> {t("eyebrow")}</div><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="heading-actions"><button className="btn secondary" onClick={()=>go("audiences")}><Users size={16}/> {t("exploreAudiences")}</button><button className="btn primary" onClick={()=>go("discover")}><Radar size={16}/> {t("newSearch")}</button></div></div>
    {page==="overview"&&<><div className="stats-grid"><Stat icon={Users} label={m.stats[0].label} value={fmt(audiences.length,locale)} sub={m.stats[0].sub} color="amber"/><Stat icon={Youtube} label={m.stats[1].label} value={fmt(results.length,locale)} sub={m.stats[1].sub} color="red"/><Stat icon={Bookmark} label={m.stats[2].label} value={fmt(saved.length,locale)} sub={m.stats[2].sub} color="blue"/><Stat icon={Sparkles} label={m.stats[3].label} value={fmt(titles.length,locale)} sub={m.stats[3].sub} color="purple"/></div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h2><Radar size={18}/> {t("quick.title")}</h2><p>{t("quick.description")}</p></div><span className="pill">{t("quick.badge")}</span></div><div className="quick-form"><label>{t("quick.country")}<select value={country} onChange={e=>{setCountry(e.target.value);setLanguage(e.target.value==="Todos"?"Todos":getLang(e.target.value))}}>{countries.map(x=><option key={x} value={x}>{m.countryNames[x]||x}</option>)}</select></label><label>{t("quick.audience")}<select onChange={e=>setActive(audiences.find(a=>a.id===e.target.value)||null)}><option value="">{t("quick.audiencePlaceholder")}</option>{audiences.filter(a=>country==="Todos"||a.country===country).map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select></label><label>{t("quick.topic")}<input value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t("quick.topicPlaceholder")}/></label><button className="btn primary full" onClick={()=>go("discover")}>{t("quick.open")} <ArrowUpRight size={16}/></button></div></section>
    <section className="panel"><div className="panel-head"><div><h2><Zap size={18}/> {t("pipeline.title")}</h2><p>{t("pipeline.description")}</p></div></div><div className="pipeline">{m.pipeline.steps.map((x,i)=><div className="pipe-row" key={x[0]}><span>{String(i+1).padStart(2,"0")}</span><div><b>{x[0]}</b><small>{x[1]}</small></div>{i<4&&<ArrowUpRight size={15}/>}</div>)}</div></section></div>
    <section className="panel"><div className="panel-head"><div><h2><Globe2 size={18}/> {t("featured.title")}</h2><p>{t("featured.description")}</p></div><button className="text-btn" onClick={()=>go("audiences")}>{t("featured.viewAll")} <ArrowUpRight size={15}/></button></div><div className="audience-cards">{audiences.slice(0,4).map(a=><AudienceCard key={a.id} a={a} onClick={()=>{setActive(a);go("discover")}} onSave={()=>save(a)} saved={saved.some(x=>x.id===a.id)} messages={m} locale={locale}/>)}</div></section></>}
    {page==="discover"&&<>
     <div className="research-layout">
      <section className="panel filters-panel">
       <div className="panel-head"><div><h2><Filter size={18}/> {t("discover.filters")}</h2><p>{t("discover.official")}</p></div></div>
       <label>{t("discover.country")}<select value={country} onChange={e=>{setCountry(e.target.value);setLanguage(e.target.value==="Todos"?"Todos":getLang(e.target.value))}}>{countries.map(x=><option key={x} value={x}>{m.countryNames[x]||x}</option>)}</select></label>
       <label>{t("discover.language")}<select value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map((x,i)=><option key={x} value={x}>{m.audienceLanguages[i]||x}</option>)}</select></label>
       <label>{t("discover.audience")}<select value={active?.id||""} onChange={e=>setActive(audiences.find(a=>a.id===e.target.value)||null)}><option value="">{t("discover.chooseAudience")}</option>{filteredAudiences.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select></label>
       <label>{t("discover.query")}<input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("discover.queryPlaceholder")}/></label>
       <label>{t("discover.order")}<select value={order} onChange={e=>setOrder(e.target.value)}><option value="viewCount">{t("discover.mostViewed")}</option><option value="date">{t("discover.newest")}</option><option value="relevance">{t("discover.relevance")}</option></select></label>
       <label>{t("discover.published")}<select value={days} onChange={e=>setDays(e.target.value)}>{m.discover.days.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
       <label>{t("discover.videoType")}<select value={videoLength} onChange={e=>setVideoLength(e.target.value)}><option value="all">{t("discover.allVideos")}</option><option value="shorts">{t("discover.shorts")}</option><option value="long">{t("discover.longVideos")}</option></select></label>
       <small className="muted">{t("discover.durationNote")}</small>
       <button className="btn primary full" onClick={searchYT} disabled={loading}>{loading?<span className="spinner"/>:<Search size={16}/>} {loading?t("discover.searching"):t("discover.search")}</button>
       <div className="hint"><Youtube size={14}/> {t("discover.apiKey")}</div>
      </section>
      <section className="panel results-panel">
       <div className="panel-head"><div><h2><BarChart3 size={18}/> {t("discover.results")}</h2><p>{searched?t(videoLength==="all"?"common.videoCount":"common.videoCountFiltered",videoLength==="all"?{count:filteredResults.length}:{shown:filteredResults.length,total:results.length}):t("discover.beforeSearch")}</p></div><span className="pill amber">{t("discover.dataDriven")}</span></div>
       {error&&<div className="error-box"><b>{t("discover.errorTitle")}</b><p>{error}</p><small>{t("discover.apiErrorHelp")}</small></div>}
       {!searched&&!error&&<div className="empty-state"><div className="empty-icon"><Youtube size={28}/></div><b>{t("discover.nextChannel")}</b><p>{t("discover.nextChannelHelp")}</p></div>}
       {searched&&results.length===0&&!error&&<div className="empty-state"><b>{t("discover.noVideos")}</b><p>{t("discover.tryAgain")}</p></div>}
       {searched&&results.length>0&&filteredResults.length===0&&!error&&<div className="empty-state"><b>{t("discover.noTypeMatch")}</b><p>{t("discover.tryAnotherType")}</p></div>}
       {filteredResults.map(v=><VideoRow key={v.id} v={v} onSave={()=>save({...current,sourceVideo:v})} saved={saved.some(x=>x.sourceVideo?.id===v.id)} messages={m} locale={locale}/>)}
      </section>
     </div>
     <section className="panel idea-panel"><div className="panel-head"><div><h2><Sparkles size={18}/> {t("generation.title")}</h2><p>{t("generation.description")}</p></div></div><div className="idea-controls"><label>{t("generation.format")}<select value={format} onChange={e=>setFormat(e.target.value)}>{formatTypes.map((f,i)=><option key={f} value={f}>{m.formatsList[i]||f}</option>)}</select></label><label>{t("generation.topic")}<input value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t("generation.topicPlaceholder")}/></label><button className="btn primary" onClick={generate}><Sparkles size={16}/> {t("generation.generate")}</button></div>{titles.length>0&&<TitleResults titles={titles} filter={titleFilter} setFilter={setTitleFilter} messages={m} locale={locale}/>}</section>
    </>}
    {page==="audiences"&&<><div className="toolbar"><label className="audience-idea-label"><span>{t("audiences.idea")}</span><div className="searchbox"><Search size={17}/><input aria-label={t("audiences.idea")} placeholder={t("audiences.placeholder")} value={audience} onChange={e=>setAudience(e.target.value)}/></div><small className="muted">{t("audiences.help")}</small></label><select aria-label={t("discover.country")} value={country} onChange={e=>{setCountry(e.target.value);setLanguage(e.target.value==="Todos"?"Todos":getLang(e.target.value))}}>{countries.map(x=><option key={x} value={x}>{m.countryNames[x]||x}</option>)}</select><select aria-label={t("discover.language")} value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map((x,i)=><option key={x} value={x}>{m.audienceLanguages[i]||x}</option>)}</select><span className="pill">{t("audiences.count",{shown:filteredAudiences.length,total:audiences.length})}</span></div>{filteredAudiences.length===0?<div className="empty-state panel"><b>{t("audiences.noMatch")}</b><p>{t("audiences.noMatchHelp")}</p></div>:<div className="audience-grid">{filteredAudiences.map(a=><AudienceCard key={a.id} a={a} onClick={()=>{setActive(a);go("discover")}} onSave={()=>save(a)} saved={saved.some(x=>x.id===a.id)} messages={m} locale={locale}/>)}</div>}</>}
    {page==="formats"&&<><div className="format-grid">{formatTypes.map((f,i)=><div className="panel format-card" key={f}><div className="format-icon"><Layers3 size={20}/></div><span className="pill">{t("formats.card",{number:String(i+1).padStart(2,"0")})}</span><h3>{m.formatsList[i]||f}</h3><p>{formatDescriptions[uiLocale]?.[i]||formatDescriptions["pt-BR"][i]}</p><button className="text-btn" onClick={()=>{setFormat(f);go("discover")}}>{t("formats.apply")} <ArrowUpRight size={15}/></button></div>)}</div><section className="panel"><h2>{t("formats.principle")}</h2><p className="muted">{t("formats.principleText")}</p></section></>}
    {page==="saved"&&<><div className="toolbar"><span className="pill amber">{t("saved.count",{count:saved.length})}</span><p className="muted">{t("saved.help")}</p></div>{saved.length===0?<div className="empty-state panel"><Bookmark size={30}/><b>{t("saved.empty")}</b><p>{t("saved.emptyHelp")}</p><button className="btn primary" onClick={()=>go("discover")}>{t("saved.start")}</button></div>:<div className="audience-grid">{saved.map(a=><AudienceCard key={a.id} a={a} onClick={()=>{setActive(a);go("discover")}} onSave={()=>save(a)} saved={true} messages={m} locale={locale}/>)}</div>}</>}
    {page==="settings"&&<section className="panel"><h2>{t("settings.title")}</h2><p className="muted">{t("settings.description")}</p><div className="setup-steps">{m.settings.steps.map((step,i)=><p key={step}><b>{i+1}.</b> {step}</p>)}</div><button className="btn secondary" onClick={()=>window.open("https://console.cloud.google.com/apis/library/youtube.googleapis.com","_blank","noopener,noreferrer")}>{t("settings.openCloud")} <ExternalLink size={15}/></button></section>}
   </main><footer className="footer">UMBRA DARK INTELLIGENCE <span>{t("footer")}</span><span>{t("prototype")}</span></footer>
  </div>
 </div>
}
function Stat({icon:Icon,label,value,sub,color}){return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19}/></div><small>{label}</small><strong>{value}</strong><span>{sub}</span></div>}
function AudienceCard({a,onClick,onSave,saved,messages,locale}){return <div className="audience-card"><div className="aud-top"><span className="country-tag">{a.flag} {a.country}</span><button className={`icon-btn ${saved?"saved":""}`} onClick={onSave} title={messages.common.save}><Bookmark size={16}/></button></div><h3>{a.label}</h3><p>{a.perspective}</p><div className="tags">{a.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><div className="aud-foot"><span>{a.language}</span><button className="text-btn" onClick={onClick}>{messages.investigate} <ArrowUpRight size={14}/></button></div></div>}
function VideoRow({v,onSave,saved,messages,locale}){const s=v.statistics||{},sn=v.snippet||{};return <div className="video-row"><img src={sn.thumbnails?.medium?.url||sn.thumbnails?.default?.url} alt=""/><div className="video-info"><a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">{sn.title}</a><small>{sn.channelTitle} · {new Date(sn.publishedAt).toLocaleDateString(locale)}</small><p>{sn.description?.slice(0,140)||messages.common.noDescription}...</p></div><div className="video-metrics"><b>{fmt(s.viewCount,locale)}</b><small>{messages.common.views}</small><span>{fmt(s.likeCount,locale)} {messages.common.likes}</span></div><button className={`icon-btn ${saved?"saved":""}`} onClick={onSave} title={messages.common.save}><Bookmark size={16}/></button></div>}
function TitleResults({titles,filter,setFilter,messages}){const rows=titles.filter(x=>x.title.toLowerCase().includes(filter.toLowerCase()));return <div className="generated"><div className="generated-head"><b><Sparkles size={16}/> {translate(messages,"common.titlesAndSummaries",{count:rows.length})}</b><div className="searchbox compact"><Search size={14}/><input aria-label={messages.common.filterTitles} value={filter} onChange={e=>setFilter(e.target.value)} placeholder={messages.common.filterTitles}/></div><button className="btn secondary small" onClick={()=>navigator.clipboard.writeText(rows.map((x,i)=>`${i+1}. ${x.title}\n${x.summary}`).join("\n\n"))}><Copy size={14}/> {messages.common.copyAll}</button></div><div className="title-list">{rows.map((x,i)=><div className="title-item" key={`${x.title}-${i}`}><span>{String(i+1).padStart(2,"0")}</span><div><b>{x.title}</b><p>{x.summary}</p><small>{x.format} · {x.language}</small></div><button className="icon-btn" title={messages.common.copyAll} onClick={()=>navigator.clipboard.writeText(x.title)}><Copy size={14}/></button></div>)}</div></div>}
