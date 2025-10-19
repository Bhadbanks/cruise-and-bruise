import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/* NOTE: Members page - searchable list with online indicator (based on lastSeen). */
export default function Members(){
  const [users, setUsers] = useState([]);
  const [qStr, setQStr] = useState("");
  const [filterOnline, setFilterOnline] = useState("all");

  useEffect(()=>{
    const q = query(collection(db,"users"), orderBy("updatedAt","desc"));
    const unsub = onSnapshot(q, snap => setUsers(snap.docs.map(d => (d.data()))));
    return unsub;
  },[]);

  const filtered = users.filter(u => {
    if(filterOnline === "online"){
      if(!u.lastSeen) return false;
      const last = (Date.now() - (u.lastSeen.toDate ? u.lastSeen.toDate().getTime() : new Date(u.lastSeen).getTime()));
      if(last > 45000) return false;
    }
    return u.username?.toLowerCase().includes(qStr.toLowerCase());
  });

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <div className="card mb-4 flex gap-2">
          <input className="input flex-1" placeholder="Search members..." value={qStr} onChange={e=>setQStr(e.target.value)} />
          <select className="input w-40" value={filterOnline} onChange={e=>setFilterOnline(e.target.value)}>
            <option value="all">All</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map(u => (
            <div className="card" key={u.username}>
              <div className="flex gap-3 items-center">
                <img src={u.photoURL || `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(u.username)}.svg`} className="w-14 h-14 rounded" alt="a" />
                <div>
                  <div className="font-bold">{u.username}</div>
                  <div className="text-sm opacity-80">{u.bio}</div>
                  <div className="text-xs mt-2">WA: {u.whatsapp || "-"}</div>
                </div>
                <div className="ml-auto text-sm">
                  {/* online indicator */}
                  {u.lastSeen && ((Date.now() - (u.lastSeen.toDate ? u.lastSeen.toDate().getTime() : new Date(u.lastSeen).getTime())) < 45000) ? <span className="text-green-400">● online</span> : <span className="text-gray-400">offline</span>}
                </div>
              </div>
            </div>
          ))}
          {!filtered.length && <div className="card">No members found.</div>}
        </div>
      </main>
    </div>
  );
  }
