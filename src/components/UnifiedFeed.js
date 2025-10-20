// src/components/UnifiedFeed.js
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import PostCard from "./PostCard";

export default function UnifiedFeed() {
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const aQ = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubA = onSnapshot(aQ, (snap) => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // fetch news from our api route
    fetch("/api/news")
      .then(r => r.json())
      .then(data => setNews(data || []))
      .catch(() => setNews([]));

    return () => { unsub(); unsubA(); };
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin announcements area (sticky/highlight) */}
      {announcements.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded shadow">
          <h3 className="font-bold mb-2">Announcements</h3>
          {announcements.map(a => (
            <div key={a.id} className="mb-2">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm">{a.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Community posts */}
      <div>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {/* News */}
      <div>
        <h3 className="text-lg font-bold mb-2">Latest News</h3>
        <div className="space-y-3">
          {news.map((article, idx) => (
            <a key={idx} href={article.url} target="_blank" rel="noreferrer" className="block p-3 bg-white rounded shadow hover:shadow-lg">
              <div className="font-semibold">{article.title}</div>
              <div className="text-sm text-gray-500">{article.source?.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
