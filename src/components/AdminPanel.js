import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "lowkeyUltimate"; // Hardcoded for simplicity

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const login = (e) => {
    e.preventDefault();
    if(password === ADMIN_PASSWORD) setAuthenticated(true);
    else alert("Wrong password!");
  };

  const postAnnouncement = async (e) => {
    e.preventDefault();
    if(!announcement) return;

    await addDoc(collection(db, "announcements"), {
      text: announcement,
      createdAt: serverTimestamp(),
      type: "admin"
    });
    setAnnouncement("");
  };

  if(!authenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#220022] to-[#440044]">
      <form onSubmit={login} className="bg-[#330033] p-6 rounded-2xl shadow-lg flex flex-col gap-3 w-80">
        <h2 className="text-xl font-bold text-pink-400 text-center">Admin Login</h2>
        <input type="password" placeholder="Enter Admin Password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 rounded bg-[#220022] text-white"/>
        <button type="submit" className="bg-pink-600 py-2 rounded font-bold hover:bg-pink-500 transition-colors">Login</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#220022] to-[#440044] flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-pink-400">Admin Panel</h1>

      <form onSubmit={postAnnouncement} className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Write announcement..."
          value={announcement}
          onChange={e=>setAnnouncement(e.target.value)}
          className="flex-1 p-2 rounded bg-[#330033] text-white"
        />
        <button type="submit" className="bg-yellow-500 px-4 rounded hover:bg-yellow-400 font-bold">Post</button>
      </form>

      <div className="w-full max-w-md flex flex-col gap-2 overflow-y-auto h-64">
        {announcements.map(a => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y:0 }}
            className="bg-yellow-500 text-black p-2 rounded font-bold"
          >
            {a.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
    }
