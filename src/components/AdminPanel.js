import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function AdminPanel() {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => setAnnouncements(snap.docs.map(doc=>({id:doc.id, ...doc.data()}))));
    return unsub;
  }, []);

  const postAnnouncement = async () => {
    if (!announcement) return;
    await addDoc(collection(db, "announcements"), { text: announcement, createdAt: serverTimestamp() });
    setAnnouncement("");
  }

  return (
    <div className="bg-[#220022] p-4 rounded w-full max-w-md mb-4 shadow-lg">
      <h2 className="text-xl mb-2">Admin Panel</h2>
      <input value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Announcement" className="mb-2" />
      <button onClick={postAnnouncement}>Post Announcement</button>
      <div className="mt-4">
        {announcements.map(a => <p key={a.id} className="admin-announcement">{a.text}</p>)}
      </div>
    </div>
  )
}
