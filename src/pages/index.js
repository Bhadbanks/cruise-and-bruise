import { useState } from "react";
import AuthForm from "../components/AuthForm";
import UserProfileForm from "../components/UserProfileForm";
import NewsTicker from "../components/NewsTicker";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);

  onAuthStateChanged(auth, (u) => {
    setUser(u);
  });

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src="/logo.png" alt="Logo" className="w-32 mb-4 float"/>
      <AuthForm onLogin={()=>setUser(auth.currentUser)} />
    </div>
  );

  if (!profileComplete) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <UserProfileForm onComplete={()=>setProfileComplete(true)} />
    </div>
  );

  return (
    <div className="p-4">
      <NewsTicker />
      <div className="text-center mb-4">
        <h1 className="text-3xl font-display text-accent mb-2">Welcome to Cruise & Bruise 🌹💬💔</h1>
        <a href="https://wa.me/2348082591190" target="_blank" className="underline text-primary">Join WhatsApp GC</a>
      </div>
    </div>
  );
    }
