import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";

/* NOTE: Navbar reads top 3 admin announcements and site meta for whatsapp link.
   Admin can edit WhatsApp link in admin page (saves to meta/site doc). */
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [ann, setAnn] = useState([]);
  const [whats, setWhats] = useState("https://wa.me/2348082591190");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => setUser(u));
    const q = query(collection(db,"announcements"), orderBy("createdAt","desc"));
    const unsubAnn = onSnapshot(q, snap => setAnn(snap.docs.map(d => ({id:d.id, ...d.data()})).slice(0,3)));

    (async () => {
      try {
        const md = await getDoc(doc(db,"meta","site"));
        if(md.exists()) setWhats(md.data().whatsappLink || whats);
      } catch(e){}
    })();

    return () => { unsubAuth(); unsubAnn(); };
  }, []);

  return (
    <header className="w-full max-w-6xl mx-auto p-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <div className="logo-box">
          <img src="/logo.png" alt="logo" width={48} height={48} style={{borderRadius:8}} />
        </div>
        <div>
          <div className="text-white font-bold">𝐂𝐫𝐮𝐢𝐬𝐞🌹 𝐚𝐧𝐝 𝐁𝐫𝐮𝐢𝐬𝐞 😹💬💔</div>
          <div className="text-sm text-gray-300">Cruise the chat. Bruise the boredom.</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-2">
          {ann.map(a => <div key={a.id} className="text-sm bg-[#330033] px-3 py-1 rounded">{a.text}</div>)}
        </div>

        <a className="btn-accent" href={whats} target="_blank" rel="noreferrer">Join WhatsApp</a>

        {user ? (
          <>
            <span className="text-sm ml-2">{user.displayName || (user.email && user.email.split("@")[0])}</span>
            <button className="ml-2 px-3 py-1 rounded bg-[#330033]" onClick={() => signOut(auth)}>Logout</button>
          </>
        ) : (
          <Link href="/"><a className="ml-2 px-3 py-1 rounded bg-[#330033]">Login</a></Link>
        )}
      </div>
    </header>
  );
  }
