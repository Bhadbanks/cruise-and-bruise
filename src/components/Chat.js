import { useState, useEffect } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap =>
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
    return unsub;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp()
    });

    setMessage("");
  }

  return (
    <div className="bg-[#220022] p-4 rounded-xl w-full max-w-2xl mx-auto shadow-lg flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.uid === auth.currentUser.uid ? "self-end bg-primary" : ""}`}>
            <p className="text-sm">{msg.email}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
  }
