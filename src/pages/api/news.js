// src/pages/api/news.js
import { Timestamp } from "firebase/firestore";

// Helper function to format the article data
const formatNewsArticle = (article) => {
    // Generate a unique ID for the external post
    const id = `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Convert article date to Firebase-compatible timestamp (seconds since epoch)
    const timestamp = Math.floor(new Date(article.publishedAt).getTime() / 1000);

    return {
        id: id,
        authorUid: 'API_BOT',
        authorUsername: article.source.name || 'News Bot',
        authorAvatar: '/bot-avatar.png', // Use the custom bot avatar
        content: article.description || article.content || 'Click to read more.',
        title: article.title,
        sourceUrl: article.url,
        timestamp: timestamp, 
        type: 'external_news', // Identifier for filtering and styling
        likes: [],
        commentCount: 0,
        isVerified: true, // Mark news source as verified
    };
};

export default async function handler(req, res) {
    // IMPORTANT: API Key is retrieved securely on the server-side
    const NEWS_API_KEY = process.env.NEWS_API_KEY; 

    if (!NEWS_API_KEY) {
        return res.status(500).json({ error: 'News API Key is not configured.' });
    }

    // Example query: 'technology'
    const query = 'social media technology'; 
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}&pageSize=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            // Filter out articles with missing essential fields and format
            const articles = data.articles
                .filter(article => article.title && article.publishedAt)
                .slice(0, 5) // Limit to 5 articles
                .map(formatNewsArticle);
            
            return res.status(200).json(articles);
        } else {
            // Handle API errors
            return res.status(response.status).json({ error: data.message || 'Failed to fetch news data.' });
        }
    } catch (error) {
        console.error('Error in news API handler:', error);
        return res.status(500).json({ error: 'Internal server error while fetching news.' });
    }
}
