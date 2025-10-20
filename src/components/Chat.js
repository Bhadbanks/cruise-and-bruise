// src/components/Chat.js
import { useState, useEffect, useRef } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Chat(){
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "globalChat"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => setMessages(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return () => unsub();
  }, []);

  const send = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !user) return;
    await addDoc(collection(db, "globalChat"), {
      author: user.displayName || user.email.split('@')[0],
      uid: user.uid,
      text: text.trim(),
      createdAt: serverTimestamp()
    });
    setText('');
    setTimeout(()=> scrollRef.current?.scrollIntoView({behavior:'smooth'}),100);
  };

  return (
    <div className="card" style={{display:'flex',flexDirection:'column',height:420}}>
      <h3>Public Chat</h3>
      <div style={{flex:1,overflowY:'auto',marginBottom:8}}>
        {messages.map(m=>(
          <div key={m.id} style={{marginBottom:6,background:m.uid===user?.uid?'#ffdede':'transparent',padding:6,borderRadius:8}}>
            <div style={{fontSize:12,fontWeight:700}}>{m.author}</div>
            <div>{m.text}</div>
            <div style={{fontSize:11,color:'#cbbdd8'}}>{new Date(m.createdAt?.toDate?.() || m.createdAt).toLocaleString()}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      {user ? (
        <form onSubmit={send} style={{display:'flex',gap:8}}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Say something..." className="input" />
          <button type="submit" className="btn">Send</button>
        </form>
      ) : <div>Please login to chat</div>}
    </div>
  );
        }
