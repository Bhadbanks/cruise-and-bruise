import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { exportUsersCSV } from "../utils/admin-helpers"; // optional helper (below)

export default function AdminPage(){
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [ann, setAnn] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(()=>{
    const q = query(collection(db,"announcements"), orderBy("createdAt","desc"));
    const unsub = onSnapshot(q, snap => setAnnouncements(snap.docs.map(d => ({id:d.id, ...d.data()}))));
    return unsub;
  },[]);

  const submitLogin = (e) => {
    e.preventDefault();
    if (pass === (process.env.NEXT_PUBLIC_ADMIN_PASS || "lowkeyUltimate")) setOk(true);
    else alert("Wrong pass");
  };

  const postAnn = async (e) => {
    e.preventDefault();
    if(!ann) return;
    await addDoc(collection(db,"announcements"), { text:ann, createdAt: serverTimestamp(), type:"admin" });
    setAnn("");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        {!ok ? (
          <div className="card max-w-md mx-auto">
            <h2 className="text-xl font-bold">Owner / Admin Login</h2>
            <form onSubmit={submitLogin} className="mt-3 flex gap-2">
              <input placeholder="passphrase" value={pass} onChange={e=>setPass(e.target.value)} />
              <button type="submit" className="btn-accent">Enter</button>
            </form>
          </div>
        ) : (
          <div>
            <div className="card mb-4">
              <h2 className="text-xl font-bold">Post Announcement</h2>
              <form onSubmit={postAnn} className="mt-2 flex gap-2">
                <input value={ann} onChange={e=>setAnn(e.target.value)} placeholder="Announcement text" />
                <button className="btn-accent">Post</button>
              </form>
            </div>
            <div className="card">
              <h3 className="font-bold">Recent Announcements</h3>
              <div className="mt-3 flex flex-col gap-2">
                {announcements.map(a => <div key={a.id} className="bg-yellow-400 text-black p-2 rounded">{a.text}</div>)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
      }
