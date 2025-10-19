import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    if(!auth.currentUser) router.push("/");
    const q = query(collection(db,"messages"), orderBy("timestamp"));
    const unsub = onSnapshot(q,snap=>setMessages(snap.docs.map(d=>d.data())));
    const qa = query(collection(db,"announcements"), orderBy("timestamp","desc"));
    const unsubA = onSnapshot(qa,snap=>setAnnouncements(snap.docs.map(d=>d.data())));
    return ()=>{ unsub(); unsubA(); }
  },[]);

  const sendMessage = async ()=>{
    if(!msg) return;
    await addDoc(collection(db,"messages"), {text: msg, sender: auth.currentUser.email, timestamp: new Date()});
    setMsg("");
  };

  return (
    <div className="flex flex-col p-4 gap-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-accent text-center">Live Chat</h1>
      
      <div className="border p-2 h-64 overflow-y-scroll flex flex-col gap-2 bg-[#220022] rounded">
        {announcements.map((a,i)=><div key={i} className="bg-[#330033] p-1 rounded font-bold text-yellow-300">📢 {a.text}</div>)}
        {messages.map((m,i)=><div key={i} className="p-1 rounded bg-[#110011]">{m.sender}: {m.text}</div>)}
      </div>

      <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message" className="p-2 rounded w-full"/>
      <button onClick={sendMessage} className="bg-primary px-6 py-2 rounded hover:bg-accent mt-2">Send</button>

      <a href="https://chat.whatsapp.com/GoD2y1glenX7mkl60g5aqT?mode=ems_copy_t" target="_blank" className="bg-accent px-6 py-2 rounded hover:bg-primary mt-4 text-center">Join WhatsApp GC</a>
    </div>
  );
    }
