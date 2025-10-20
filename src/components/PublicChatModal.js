import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

export default function PublicChatModal({ currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "public_chat"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const send = async () => {
    if (!text.trim() || !currentUser) return;
    await addDoc(collection(db, "public_chat"), {
      fromUid: currentUser.uid,
      username: currentUser.displayName || currentUser.email.split("@")[0],
      text,
      createdAt: new Date()
    });
    setText("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full md:w-1/3 p-4 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Public Chat</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
        <div className="h-64 overflow-auto mb-3">
          {messages.map(m => (
            <div key={m.id} className="mb-2">
              <div className="text-sm font-semibold">{m.username}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Say something..." />
          <button onClick={send} className="bg-pink-500 text-white px-3 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
