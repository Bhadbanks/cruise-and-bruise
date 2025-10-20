export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data.articles);
}
