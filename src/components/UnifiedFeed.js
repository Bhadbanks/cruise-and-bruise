import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { fetchNews } from "../utils/helpers";

export default function UnifiedFeed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [content, setContent] = useState("");

  // Fetch all posts (user posts + admin announcements)
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // Fetch news (random categories)
  useEffect(() => {
    async function loadNews() {
      const articles = await fetchNews(["general", "sports", "entertainment", "technology"]);
      setNews(articles);
    }
    loadNews();
  }, []);

  // Admin announcement (visible on top)
  useEffect(() => {
    const adminRef = collection(db, "announcements");
    const q = query(adminRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const latest = snapshot.docs[0]?.data();
      setAnnouncement(latest?.message || "");
    });
    return unsubscribe;
  }, []);

  // User posting
  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addDoc(collection(db, "posts"), {
      username: currentUser?.username || "Anonymous",
      content,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
      verified: currentUser?.isAdmin || false,
    });
    setContent("");
  };

  return (
    <div className="relative z-10">
      {/* Admin announcement banner */}
      {announcement && (
        <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 text-white p-3 rounded-lg mb-4 text-center font-semibold shadow-md">
          📢 {announcement}
        </div>
      )}

      {/* Post box */}
      {currentUser && (
        <form
          onSubmit={handlePost}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-4"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-pink-200 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-pink-400"
            placeholder="💭 What's happening in the Special Squad?"
            rows="3"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
          >
            Post
          </button>
        </form>
      )}

      {/* User feed */}
      <h2 className="text-xl font-bold mb-2">🔥 Special Squad Feed</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet. Be the first to post!</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white/90 backdrop-blur-sm border border-pink-100 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-pink-600">
                {post.username}
                {post.verified && <span className="text-yellow-400 ml-1">✔️</span>}
              </p>
              <small className="text-gray-400">
                {post.createdAt?.toDate
                  ? post.createdAt.toDate().toLocaleString()
                  : "Just now"}
              </small>
            </div>
            <p className="text-gray-800">{post.content}</p>
          </div>
        ))
      )}

      {/* News section */}
      <h2 className="text-xl font-bold mt-6 mb-3">📰 Trending Now</h2>
      {news.map((article, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-r from-white via-pink-50 to-yellow-50 border border-pink-100 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-pink-600 hover:underline"
          >
            {article.title}
          </a>
          <p className="text-sm text-gray-500 mt-1">{article.source.name}</p>
        </div>
      ))}
    </div>
  );
            }
