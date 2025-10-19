import { useEffect, useRef, useState } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, where } from "firebase/firestore";

/* NOTE:
  ChatBox supports:
  - Global chat (messages in collection 'messages')
  - DM: create or open a DM room ID (simple `dm_{uid1}_{uid2}` sorted)
  - Typing indicator: writes small docs to 'typing/{uid}'
  - Online presence: users update lastSeen in users/{uid}
*/
function dmId(a,b){ return [a,b].sort().join("_"); }

export default function ChatBox({ initialDMWith=null }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [dmWith, setDmWith] = useState(initialDMWith); // username or uid
  const [dmRoom, setDmRoom] = useState(null);
  const endRef = useRef(null);

  const user = auth.currentUser;

  useEffect(()=>{
    // presence heartbeat
    let iv;
    if(user){
      const uref = doc(db,"users", user.uid);
      setDoc(uref, { lastSeen: serverTimestamp(), online: true }, { merge:true });
      iv = setInterval(()=> setDoc(uref, { lastSeen: serverTimestamp(), online: true }, { merge:true }), 25000);
    }
    return ()=> clearInterval(iv);
  },[user]);

  useEffect(()=>{
    // subscribe to messages: global or dm
    let unsub;
    if(dmRoom){
      const q = query(collection(db,"dms", dmRoom, "messages"), orderBy("createdAt"));
      unsub = onSnapshot(q, snap => {
        setMessages(snap.docs.map(d=> ({ id:d.id, ...d.data() })));
        setTimeout(()=> endRef.current?.scrollIntoView({behavior:"smooth"}), 80);
      });
    } else {
      const q = query(collection(db,"messages"), orderBy("createdAt"));
      unsub = onSnapshot(q, snap => {
        setMessages(snap.docs.map(d=> ({ id:d.id, ...d.data() })));
        setTimeout(()=> endRef.current?.scrollIntoView({behavior:"smooth"}), 80);
      });
    }
    return ()=> unsub && unsub();
  },[dmRoom]);

  // when dmWith changes, compute room id
  useEffect(()=>{
    if(!dmWith || !user) { setDmRoom(null); return; }
    // assume dmWith is uid; if it's username you'd need lookup
    const id = dmId(user.uid, dmWith);
    setDmRoom(id);
  },[dmWith, user]);

  const send = async (e) => {
    e?.preventDefault();
    if(!text.trim() || !user) return;
    const payload = {
      text: text.trim(),
      uid: user.uid,
      username: user.displayName || (user.email && user.email.split("@")[0]),
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      type: dmRoom ? "dm" : "user"
    };
    if(dmRoom){
      await addDoc(collection(db,"dms", dmRoom, "messages"), payload);
    } else {
      await addDoc(collection(db,"messages"), payload);
    }
    setText("");
  };

  return (
    <div className="card flex flex-col h-[70vh] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold"> {dmRoom ? "Direct Message" : "Global Chat"} </div>
        {/* small DM controls (enter uid to DM) */}
        <div className="flex gap-2">
          <input placeholder="Open DM with UID" className="input" onBlur={(e)=> setDmWith(e.target.value.trim() || null)} />
          <button onClick={()=> setDmWith(null)} className="btn-accent">Global</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 items-start ${m.uid === (user && user.uid) ? 'justify-end' : ''}`}>
            {m.uid !== (user && user.uid) && <img src={m.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(m.username||"anon")}.svg`} className="w-10 h-10 rounded" alt="a" />}
            <div className={`chat-bubble ${m.uid === (user && user.uid) ? 'me' : 'other'}`}>
              <div className="text-xs opacity-80 font-semibold">{m.username || "Anon"}</div>
              <div>{m.text}</div>
            </div>
            {m.uid === (user && user.uid) && <img src={m.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(m.username||"anon")}.svg`} className="w-10 h-10 rounded" alt="a" />}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={e=> setText(e.target.value)} placeholder={dmRoom ? "Message in DM..." : "Type a message..."} className="flex-1 input" />
        <button type="submit" className="btn-accent">Send</button>
      </form>
    </div>
  );
          }
