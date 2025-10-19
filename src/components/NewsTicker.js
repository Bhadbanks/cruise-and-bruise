import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsTicker() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  if (!announcements.length) return null;

  return (
    <div className="w-full overflow-hidden bg-[#330033] rounded-xl p-2 mb-4 shadow-lg">
      <div className="flex animate-scroll whitespace-nowrap gap-6">
        <AnimatePresence>
          {announcements.map(a => (
            <motion.span
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white font-bold text-sm"
            >
              {a.text} 🌹
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          display: inline-flex;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
    }
