import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function UnifiedFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  // Auth listener
  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        text: newPost,
        author: user?.displayName || "Anonymous",
        email: user?.email,
        timestamp: serverTimestamp(),
        likes: 0,
        type: "userPost",
      });
      setNewPost("");
      alert("✨ Post shared successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
      {/* Post box */}
      {user && (
        <form onSubmit={handlePost} className="mb-6">
          <textarea
            className="w-full border border-pink-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="What's new in the Squad? 💬"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
            >
              <p className="text-gray-800">{post.text}</p>
              <p className="text-sm text-gray-500 mt-2">
                — <span className="font-semibold text-pink-600">{post.author}</span> |{" "}
                {post.type === "announcement" && (
                  <span className="text-yellow-600 font-semibold">📢 Announcement</span>
                )}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts yet. Be the first to share! 🚀</p>
        )}
      </div>
    </section>
  );
              }
