import { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) return <p className="text-center mt-20 text-xl">Welcome! Go to <a href="/chat" className="text-accent underline">Chat</a></p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110011] via-[#220022] to-[#330033] flex flex-col items-center justify-center">
      <img src="/logo.png" className="w-32 h-32 mb-8 float" alt="Logo" />
      <AuthForm onLogin={()=>setLoggedIn(true)} />
      <p className="mt-4 text-sm text-center">
        Join the GC on WhatsApp: <a href="https://chat.whatsapp.com/GoD2y1glenX7mkl60g5aqP" className="text-accent underline" target="_blank">Cruise & Bruise 🌹💬</a>
      </p>
    </div>
  )
    }
