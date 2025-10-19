import { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import UserProfileForm from "../components/UserProfileForm";
import NewsTicker from "../components/NewsTicker";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#220022] to-[#440044] relative overflow-hidden">
  
  {/* Floating background elements */}
  <motion.div 
    className="absolute w-32 h-32 bg-rose-500 rounded-full opacity-20"
    animate={{ y: [0, 50, 0] }}
    transition={{ duration: 6, repeat: Infinity }}
  />
  <motion.div 
    className="absolute top-1/4 left-10 w-24 h-24 bg-pink-500 rounded-full opacity-25"
    animate={{ x: [0, 40, 0] }}
    transition={{ duration: 5, repeat: Infinity }}
  />

  {/* Logo */}
  <motion.img
    src="/logo.png"
    alt="Cruise & Bruise Logo"
    className="w-40 mb-6 z-10"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1 }}
  />

  {/* Centered login/register card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    className="bg-[#330033] p-6 rounded-2xl shadow-lg z-10 w-full max-w-md mx-auto"
  >
    <AuthForm onLogin={() => setUser(auth.currentUser)} />
  </motion.div>
</div>
    
        <AuthForm onLogin={() => setUser(auth.currentUser)} />
      </motion.div>
    </div>
  );

  if (!profileComplete) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#220022] to-[#440044]">
      <UserProfileForm onComplete={() => setProfileComplete(true)} />
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#220022] to-[#440044]">
      <NewsTicker />
      <div className="text-center mt-10">
        <motion.h1 className="text-4xl font-bold text-accent mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          Welcome to Cruise & Bruise 🌹💬💔
        </motion.h1>
        <motion.a
          href="https://wa.me/2348082591190"
          target="_blank"
          className="inline-block mt-4 px-6 py-3 bg-pink-600 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
        >
          Join the WhatsApp GC
        </motion.a>
      </div>
    </div>
  );
  }
