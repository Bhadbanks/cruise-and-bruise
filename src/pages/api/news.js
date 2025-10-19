// NOTE: optional. If NEXT_PUBLIC_NEWS_API_KEY is set, this route will fetch latest headlines from newsdata.io or gnews.
// Keep rate limits in mind — otherwise Code seeds trends in Firestore which we read on front-end.
export default async function handler(req, res) {
  const key = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  if(!key) return res.status(400).json({ error: "No API key configured" });
  const provider = process.env.NEXT_PUBLIC_NEWS_PROVIDER || "newsdata";
  try {
    if(provider === "newsdata") {
      const q = `https://newsdata.io/api/1/news?apikey=${key}&language=en`;
      const r = await fetch(q).then(r=>r.json());
      return res.status(200).json(r);
    } else {
      // gnews example
      const q = `https://gnews.io/api/v4/top-headlines?token=${key}&lang=en&max=10`;
      const r = await fetch(q).then(r=>r.json());
      return res.status(200).json(r);
    }
  } catch(e){
    return res.status(500).json({ error: e.message });
  }
}
