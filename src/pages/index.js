import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UnifiedFeed from "../components/UnifiedFeed";
import PremiumAnimation from "../components/PremiumAnimation";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL || "/default-avatar.png",
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50 relative overflow-hidden">
      <PremiumAnimation />
      <Header currentUser={currentUser} />
      <main className="max-w-5xl mx-auto p-4 mt-24 space-y-6">
        <UnifiedFeed currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
