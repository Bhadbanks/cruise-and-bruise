import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, onSnapshot, addDoc, orderBy } from "firebase/firestore";

export default function Chat({ currentUser, targetUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!currentUser || !targetUser) return;
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map(doc => doc.data())
        .filter(m => m.participants.includes(targetUser.uid));
      setMessages(msgs);
    });
    return () => unsub();
  }, [currentUser, targetUser]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "messages"), {
      participants: [currentUser.uid, targetUser.uid],
      from: currentUser.uid,
      to: targetUser.uid,
      message: input,
      createdAt: new Date()
    });
    setInput("");
  };

  return (
    <div className="border rounded p-3 shadow h-96 flex flex-col justify-between bg-white dark:bg-gray-800">
      <div className="overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-1 ${msg.from === currentUser.uid ? "text-right" : "text-left"}`}>
            <span className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 inline-block">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-pink-500 text-white px-3 rounded hover:bg-pink-600">
          Send
        </button>
      </div>
    </div>
  );
    }
