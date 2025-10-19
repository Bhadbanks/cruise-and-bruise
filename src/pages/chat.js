import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Chat(){
  const router = useRouter();
  const [messages,setMessages] = useState([]);
  const [msg,setMsg] = useState("");

  useEffect(()=>{
    if(!auth.currentUser) router.push("/");
    const q = query(collection(db,"messages"),orderBy("timestamp"));
    const unsub = onSnapshot(q,snap=>setMessages(snap.docs.map(doc=>doc.data())));
    return ()=>unsub();
  },[]);

  const sendMessage = async ()=>{
    if(!msg) return;
    await addDoc(collection(db,"messages"),{text:msg,sender:auth.currentUser.email,timestamp:new Date()});
    setMsg("");
  }

  return(
    <div className="flex flex-col p-4 gap-2 text-white">
      <h1 className="text-3xl font-bold text-accent">Live Chat</h1>
      <div className="border p-2 h-96 overflow-y-scroll flex flex-col gap-2">
        {messages.map((m,i)=>(
          <div key={i} className="p-1 rounded bg-[#220022]">{m.sender}: {m.text}</div>
        ))}
      </div>
      <input className="p-2 rounded bg-[#330033] w-full" value={msg} onChange={e=>setMsg(e.target.value)}/>
      <button onClick={sendMessage} className="bg-primary px-6 py-2 rounded hover:bg-accent mt-2">Send</button>
      <a href="https://chat.whatsapp.com/GoD2y1glenX7mkl60g5aqT?mode=ems_copy_t" target="_blank" className="bg-accent px-6 py-2 rounded hover:bg-primary mt-4">Join the WhatsApp GC</a>
    </div>
  )
    }
