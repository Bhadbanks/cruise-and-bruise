// src/pages/api/news.js
export default async function handler(req,res){
  const key = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || process.env.NEXT_PUBLIC_NEWS_API;
  if (!key) return res.status(500).json({ error: "News API key not configured" });
  try {
    const r = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&pageSize=6&apiKey=${key}`);
    const json = await r.json();
    return res.status(200).json(json.articles || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
