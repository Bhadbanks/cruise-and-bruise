import { useState, useEffect, useRef } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      scrollToBottom();
    });
    return unsub;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async e => {
    e.preventDefault();
    if (!message) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp(),
      type: "user"
    });

    setMessage("");
  };

  return (
    <div className="bg-[#220022] p-4 rounded-2xl shadow-xl w-full max-w-3xl mx-auto flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-2 items-start ${msg.uid === auth.currentUser.uid ? "self-end justify-end" : "self-start"}`}
            >
              <img
                src={msg.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(msg.email)}.svg`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className={`p-2 rounded-lg ${msg.uid === auth.currentUser.uid ? "bg-pink-600 text-white" : msg.type==="admin" ? "bg-yellow-500 text-black font-bold" : "bg-[#330033] text-white"}`}>
                <p className="text-xs opacity-70">{msg.email}</p>
                <p>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-[#330033] text-white"
        />
        <button type="submit" className="bg-pink-600 px-4 rounded hover:bg-pink-500 transition-colors font-bold">Send</button>
      </form>
    </div>
  );
                       }
