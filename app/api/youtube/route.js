import { NextResponse } from "next/server";
const countryCodes={"Estados Unidos":"US","Canadá":"CA","Brasil":"BR","Japão":"JP","Alemanha":"DE","França":"FR","Rússia":"RU","Coreia do Sul":"KR","México":"MX","Reino Unido":"GB"};
export async function GET(req){
 const {searchParams}=new URL(req.url);const key=process.env.YOUTUBE_API_KEY;
 if(!key)return NextResponse.json({error:"YOUTUBE_API_KEY não configurada no servidor."},{status:503});
 const q=(searchParams.get("q")||"").trim();if(!q)return NextResponse.json({error:"Informe um termo de busca."},{status:400});
 const country=countryCodes[searchParams.get("country")]||searchParams.get("country")||"US";
 const days=Math.min(1825,Math.max(1,Number(searchParams.get("days")||365)));
 const after=new Date(Date.now()-days*86400000).toISOString();
 const order=["date","viewCount","relevance"].includes(searchParams.get("order"))?searchParams.get("order"):"viewCount";
 try{
  const params=new URLSearchParams({part:"snippet",q,type:"video",maxResults:String(Math.min(25,Math.max(1,Number(searchParams.get("maxResults")||25)))),order,publishedAfter:after,regionCode:country,relevanceLanguage:"en",key});
  const sr=await fetch("https://www.googleapis.com/youtube/v3/search?"+params,{next:{revalidate:300}});
  const sd=await sr.json();if(!sr.ok)return NextResponse.json({error:sd.error?.message||"Erro na API YouTube",reason:sd.error?.errors?.[0]?.reason},{status:sr.status});
  const ids=(sd.items||[]).map(x=>x.id.videoId).filter(Boolean);
  if(!ids.length)return NextResponse.json({items:[],pageInfo:sd.pageInfo});
  const vr=await fetch("https://www.googleapis.com/youtube/v3/videos?"+new URLSearchParams({part:"statistics,contentDetails",id:ids.join(","),key}),{next:{revalidate:300}});
  const vd=await vr.json();const stats=new Map((vd.items||[]).map(x=>[x.id,x]));
  const items=(sd.items||[]).map(x=>({...x,...(stats.get(x.id.videoId)||{}),id:x.id.videoId}));
  return NextResponse.json({items,pageInfo:sd.pageInfo,nextPageToken:sd.nextPageToken,regionCode:country,query:q});
 }catch(e){return NextResponse.json({error:"Falha de conexão com YouTube API."},{status:500})}
}
