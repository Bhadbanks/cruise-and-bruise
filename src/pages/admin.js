import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";

/* NOTE: admin pass from env variable */
export default function AdminPage(){
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [ann, setAnn] = useState("");
  const [whats, setWhats] = useState("");

  useEffect(()=> {
    (async ()=> {
      const md = await getDoc(doc(db,"meta","site"));
      if(md.exists()) setWhats(md.data().whatsappLink || "");
    })();
  },[]);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "lowkeyUltimate";

  const submitLogin = (e) => { e.preventDefault(); if(pass === ADMIN_PASS) setOk(true); else alert("Wrong pass"); };

  const postAnn = async (e) => { e.preventDefault(); if(!ann) return; await addDoc(collection(db,"announcements"), { text:ann, createdAt: serverTimestamp(), type:"admin" }); setAnn(""); };

  const saveWhats = async (e) => { e.preventDefault(); await setDoc(doc(db,"meta","site"), { whatsappLink: whats }, { merge:true }); alert("Saved"); };

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        {!ok ? (
          <div className="card max-w-md mx-auto">
            <h2 className="text-xl font-bold">Owner / Admin Login</h2>
            <form onSubmit={submitLogin} className="mt-3 flex gap-2">
              <input className="input" placeholder="passphrase" value={pass} onChange={e=>setPass(e.target.value)} />
              <button type="submit" className="btn-accent">Enter</button>
            </form>
          </div>
        ) : (
          <>
            <div className="card mb-4">
              <h2>Post Announcement</h2>
              <form onSubmit={postAnn} className="mt-2 flex gap-2">
                <input className="input" value={ann} onChange={e=>setAnn(e.target.value)} placeholder="Announcement text" />
                <button className="btn-accent">Post</button>
              </form>
            </div>

            <div className="card">
              <h2>Edit WhatsApp GC Link</h2>
              <form onSubmit={saveWhats} className="mt-2 flex gap-2">
                <input className="input" value={whats} onChange={e=>setWhats(e.target.value)} placeholder="https://wa.me/..." />
                <button className="btn-accent">Save</button>
              </form>
              <div className="text-sm mt-2">This link is used across the site for Join GC button.</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
          }
