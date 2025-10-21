// This Next.js API route securely fetches news headlines from an external provider.
// It acts as a backend proxy to keep the API key safe.

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export default async function handler(req, res) {
  // 1. Enforce GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY is not set in environment variables.");
    return res.status(500).json({ message: 'Server configuration error: News API key missing.' });
  }

  // 2. Define the external API URL
  // Example using NewsAPI.org. Adjust the URL based on your chosen provider.
  const externalApiUrl = `https://newsapi.org/v2/top-headlines?country=ng&pageSize=5&apiKey=${NEWS_API_API_KEY}`;
  
  try {
    const apiResponse = await fetch(externalApiUrl);

    if (!apiResponse.ok) {
      // Handle non-200 responses from the external API
      console.error(`External API error: ${apiResponse.statusText}`);
      return res.status(apiResponse.status).json({ message: 'Failed to fetch news from external source.' });
    }

    const data = await apiResponse.json();
    
    // 3. Transform the external data into the app's internal Post format
    const formattedNews = data.articles.map((article, index) => ({
      // Use a unique ID structure for external items
      id: `ext-news-${index}-${Date.now()}`, 
      type: 'external_news', 
      title: article.title,
      // Use a summary or description for content
      content: article.description || article.content || 'Click to read full article.',
      authorUsername: article.source.name || 'External News',
      authorAvatar: '/bot-avatar.png', // Default placeholder for external news
      timestamp: article.publishedAt ? new Date(article.publishedAt).getTime() / 1000 : Date.now() / 1000,
      sourceUrl: article.url,
      isVerified: true, // Mark news as verified
      likes: [],
      commentCount: 0,
    }));

    // 4. Send the successful, formatted response
    return res.status(200).json(formattedNews);

  } catch (error) {
    console.error('Error in news API route:', error);
    return res.status(500).json({ message: 'Internal server error while processing news request.' });
  }
}
