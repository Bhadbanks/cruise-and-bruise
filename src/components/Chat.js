import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const sendMessage = async () => {
    if (!text) return;
    await addDoc(collection(db, "messages"), {
      text,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp()
    });
    setText("");
  }

  return (
    <div className="w-full max-w-2xl p-4">
      <div className="h-80 overflow-y-scroll mb-4 border rounded p-2">
        {messages.map(m => (
          <div key={m.id} className="chat-message">{m.email}: {m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1" placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
