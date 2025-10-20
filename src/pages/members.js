import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserCard from "../components/UserCard";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Members() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50">
      <Header />
      <main className="max-w-4xl mx-auto p-4 mt-24">
        <h2 className="text-2xl font-bold mb-4">Members</h2>
        {users.map(user => <UserCard key={user.id} user={user} />)}
      </main>
      <Footer />
    </div>
  );
}
