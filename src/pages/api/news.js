// src/pages/api/news.js
export default async function handler(req, res) {
  const key = process.env.NEWS_API_KEY;
  if (!key) return res.status(500).json({ error: "No NEWS_API_KEY configured" });

  try {
    const resp = await fetch(`https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey=${key}`);
    const data = await resp.json();
    return res.status(200).json(data.articles || []);
  } catch (err) {
    console.error("news error", err);
    return res.status(500).json({ error: "Failed fetching news" });
  }
      }
