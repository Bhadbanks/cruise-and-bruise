import { useEffect, useState } from "react";
import { fetchPosts, fetchNews } from "../utils/helpers";
import PostCard from "./PostCard";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function getData() {
      const p = await fetchPosts();
      const n = await fetchNews();
      setPosts(p);
      setNews(n);
    }
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <h2 className="text-xl font-bold">Community Feed</h2>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      <h2 className="text-xl font-bold mt-6">Latest News</h2>
      {news.map((article, idx) => (
        <div key={idx} className="border p-3 rounded shadow bg-white dark:bg-gray-800">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
            {article.title}
          </a>
          <p className="text-sm text-gray-500">{article.source.name}</p>
        </div>
      ))}
    </div>
  );
      }
