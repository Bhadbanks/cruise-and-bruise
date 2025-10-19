import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Members(){
  const [users, setUsers] = useState([]);
  useEffect(()=>{
    const q = query(collection(db,"users"), orderBy("updatedAt","desc"));
    const unsub = onSnapshot(q,snap => setUsers(snap.docs.map(d => d.data())));
    return unsub;
  },[]);
  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.username} className="card">
              <div className="flex gap-3 items-center">
                <img src={u.photoURL} className="avatar" alt="a" />
                <div>
                  <div className="font-bold">{u.username}</div>
                  <div className="text-sm opacity-80">{u.bio}</div>
                  <div className="text-xs mt-2">WA: {u.email || "-"}</div>
                </div>
              </div>
            </div>
          ))}
          {!users.length && <div className="card">No members yet.</div>}
        </div>
      </main>
    </div>
  );
}
