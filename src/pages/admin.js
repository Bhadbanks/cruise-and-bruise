import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const postsSnap = await getDocs(collection(db, "posts"));
      setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50">
      <Header currentUser={{ username: "Admin", verified: true }} />
      <main className="max-w-5xl mx-auto p-4 mt-24">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <p>Total Registered Users: {users.length}</p>
        <p>Total Posts: {posts.length}</p>
        {/* Add moderation tools here */}
      </main>
      <Footer />
    </div>
  );
        }
// src/utils/admin.js
export function isAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
}
