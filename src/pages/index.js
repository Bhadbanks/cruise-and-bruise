import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsFeed from "../components/NewsFeed";
import UnifiedFeed from "../components/UnifiedFeed";
import FloatingAnimation from "../components/FloatingAnimation";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUsers } from "../utils/helpers";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, username: user.displayName });
      } else setCurrentUser(null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50 relative">
      <FloatingAnimation />
      <Header currentUser={currentUser} />
      <main className="max-w-4xl mx-auto p-4 mt-24">
        <NewsFeed />
      </main>
      <Footer />
    </div>
  );
}
