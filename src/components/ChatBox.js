import { useEffect, useRef, useState } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function ChatBox(){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(()=>{
    const q = query(collection(db,"messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(()=> endRef.current?.scrollIntoView({behavior:"smooth"}), 80);
    });
    return unsub;
  },[]);

  const send = async (e) => {
    e.preventDefault();
    if(!text.trim() || !auth.currentUser) return;
    await addDoc(collection(db,"messages"), {
      text: text.trim(),
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp(),
      type: "user"
    });
    setText("");
  };

  return (
    <div className="card flex flex-col h-[70vh] max-w-3xl mx-auto">
      <div className="flex-1 overflow-auto p-2 flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 items-start ${m.uid === (auth.currentUser && auth.currentUser.uid) ? 'justify-end' : ''}`}>
            {m.uid !== (auth.currentUser && auth.currentUser.uid) && (
              <img src={m.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(m.email||"anon")}.svg`} className="avatar" alt="a" />
            )}
            <div className={`${m.uid === (auth.currentUser && auth.currentUser.uid) ? 'bg-pink-600 text-black self-end rounded-lg px-3 py-2' : 'bg-[#330033] rounded-lg px-3 py-2'}`}>
              <div className="text-xs opacity-70">{m.email || "Anon"}</div>
              <div>{m.text}</div>
            </div>
            {m.uid === (auth.currentUser && auth.currentUser.uid) && (
              <img src={m.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(m.email||"anon")}.svg`} className="avatar" alt="a" />
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 rounded bg-transparent border border-white/5" />
        <button type="submit" className="btn-accent">Send</button>
      </form>
    </div>
  );
}
