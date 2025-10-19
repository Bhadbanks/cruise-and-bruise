import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");
  const [messages, setMessages] = useState([]);
  
  useEffect(()=>{
    if(!auth.currentUser || auth.currentUser.email!=="lowkey@admin.com") router.push("/");
    const q = query(collection(db,"messages"), orderBy("timestamp"));
    const unsub = onSnapshot(q,snap=>setMessages(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  const postAnnouncement = async ()=>{
    if(!announcement) return;
    await addDoc(collection(db,"announcements"), {text: announcement, timestamp:new Date()});
    setAnnouncement("");
  };

  const deleteMessage = async (id)=> await deleteDoc(doc(db,"messages",id));

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl font-bold text-accent">Admin Panel</h1>
      <input value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Announcement" className="p-2 rounded w-80"/>
      <button onClick={postAnnouncement} className="bg-primary px-6 py-2 rounded hover:bg-accent">Post Announcement</button>
      <div className="border p-2 w-96 max-h-64 overflow-y-scroll">
        {messages.map(m=>(
          <div key={m.id} className="flex justify-between bg-[#220022] p-1 rounded my-1">
            <span>{m.sender}: {m.text}</span>
            <button onClick={()=>deleteMessage(m.id)} className="bg-red-600 px-2 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
    }
