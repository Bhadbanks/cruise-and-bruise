import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UnifiedFeed from "../components/UnifiedFeed";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
        });
        const hasJoined = localStorage.getItem("joinedGC");
        if (!hasJoined) {
          setShowJoinPrompt(true);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleJoinGC = () => {
    localStorage.setItem("joinedGC", "true");
    setShowJoinPrompt(false);
    window.open(
      "https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz?mode=ems_copy_t",
      "_blank"
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-100 via-red-50 to-yellow-100 overflow-hidden">
      {/* Smooth Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-ping"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* Header */}
      <Header currentUser={currentUser} />

      {/* Main Feed */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 mt-24">
        {currentUser ? (
          <UnifiedFeed currentUser={currentUser} />
        ) : (
          <div className="text-center py-16">
            <h1 className="text-3xl font-extrabold text-pink-600 mb-3">
              👑✨💥 Special Squad 💥✨👑
            </h1>
            <p className="text-gray-600 mb-6">
              Join the most vibrant squad on the web.  
              Connect, post, react, and shine with{" "}
              <span className="text-pink-600 font-semibold">
                ༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻
              </span>
              !
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-pink-600 border border-pink-400 px-6 py-2 rounded-lg font-semibold shadow hover:bg-pink-50 transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Join GC Prompt */}
      {showJoinPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm text-center">
            <h2 className="text-xl font-bold text-pink-600 mb-2">
              💬 Join Special Squad GC
            </h2>
            <p className="text-gray-600 mb-4">
              To complete your registration, please join our official WhatsApp group.  
              It’s required to connect with the community.
            </p>
            <button
              onClick={handleJoinGC}
              className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
            >
              Join Now
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
