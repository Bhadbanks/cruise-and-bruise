import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

/* NOTE: Explore page — posts collection: users can post short cards (like tweets).
   Posts: { authorUid, author, content, createdAt, likesCount } */
export default function Explore(){
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  useEffect(()=>{
    const q = query(collection(db,"posts"), orderBy("createdAt","desc"));
    const unsub = onSnapshot(q, snap => setPosts(snap.docs.map(d => ({ id:d.id, ...d.data() }))));
    return unsub;
  },[]);

  const post = async (e) => {
    e.preventDefault();
    if(!auth.currentUser || !text.trim()) return;
    await addDoc(collection(db,"posts"), {
      authorUid: auth.currentUser.uid,
      author: auth.currentUser.displayName || (auth.currentUser.email && auth.currentUser.email.split("@")[0]),
      content: text.trim(),
      createdAt: serverTimestamp(),
      likesCount: 0
    });
    setText("");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="card mb-4">
          <form onSubmit={post} className="flex flex-col gap-2">
            <textarea className="input" rows="3" value={text} onChange={e=>setText(e.target.value)} placeholder="Share something..." />
            <div className="flex justify-end">
              <button className="btn-accent">Post</button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="card">
              <div className="flex items-start gap-3">
                <img className="w-12 h-12 rounded" src={p.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(p.author)}.svg`} alt="a" />
                <div>
                  <div className="font-bold">{p.author}</div>
                  <div className="text-sm opacity-80">{p.content}</div>
                  <div className="mt-2 text-xs opacity-60">Likes: {p.likesCount || 0}</div>
                </div>
              </div>
            </div>
          ))}
          {!posts.length && <div className="card">No posts yet.</div>}
        </div>
      </main>
    </div>
  );
}
