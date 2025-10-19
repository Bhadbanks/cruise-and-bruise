import Navbar from "../components/Navbar";
import ParticleBackground from "../components/ParticleBackground";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";

/* NOTE: Home dashboard shows personalized welcome, announcements, trending area. */
export default function HomeDashboard(){
  const [userData, setUserData] = useState(null);
  const [ann, setAnn] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(()=> {
    const unsubAuth = onAuthStateChanged(auth, async u => {
      if(!u) { setUserData(null); return; }
      const snap = await getDoc(doc(db,"users", u.uid));
      setUserData(snap.exists() ? snap.data() : null);
    });
    const q = query(collection(db,"announcements"), orderBy("createdAt","desc"));
    const unsubAnn = onSnapshot(q, snap => setAnn(snap.docs.map(d=> ({id:d.id, ...d.data()})).slice(0,4)));
    const qt = query(collection(db,"trends"), orderBy("createdAt","desc"));
    const unsubT = onSnapshot(qt, snap => setTrends(snap.docs.map(d=> ({id:d.id, ...d.data()})).slice(0,6)));
    return ()=> { unsubAuth(); unsubAnn(); unsubT(); };
  },[]);

  return (
    <div>
      <ParticleBackground />
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <div className="card mb-4">
            <h2 className="text-xl font-bold">Welcome back{userData?.username ? `, ${userData.username}` : ""} 👋</h2>
            <p className="mt-2">Your dashboard — quick links below.</p>
            <div className="mt-4 flex gap-3">
              <Link href="/chat"><a className="btn-accent">Live Chat</a></Link>
              <Link href="/explore"><a className="btn-accent">Explore</a></Link>
              <Link href="/members"><a className="btn-accent">Members</a></Link>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">Public Feed</h3>
            <p className="mt-2"><Link href="/explore"><a className="text-accent1 underline">Open feed & engage</a></Link></p>
          </div>
        </section>

        <aside>
          <div className="card mb-4">
            <h3 className="font-bold">Announcements</h3>
            <div className="mt-3 flex flex-col gap-2">
              {ann.map(a => <div key={a.id} className="bg-[#330033] p-2 rounded">{a.text}</div>)}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">Trending Now</h3>
            <div className="mt-3 flex flex-col gap-2">
              {trends.map(t => <a key={t.id} className="text-sm underline" href={t.url || "#"} target="_blank" rel="noreferrer">{t.title}</a>)}
              {!trends.length && <div className="text-sm text-gray-300">No trends yet.</div>}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
