// src/pages/admin.js
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllUsers, getPosts } from "../utils/helpers";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function AdminPage(){
  const [current] = useAuthState(auth);
  const [users,setUsers] = useState([]);
  const [posts,setPosts] = useState([]);
  const [announcement, setAnnouncement] = useState('');

  useEffect(()=> {
    (async ()=> {
      setUsers(await getAllUsers());
      setPosts(await getPosts());
    })();
  },[]);

  const postAnnouncement = async () => {
    if (!announcement.trim()) return;
    await addDoc(collection(db, 'announcements'), { text: announcement.trim(), createdAt: serverTimestamp(), author: current?.email || 'admin' });
    setAnnouncement('');
  };

  // Admin guard
  const isAdmin = current?.email === process.env.ADMIN_EMAIL;

  if (!isAdmin) return <div style={{padding:40}}>Unauthorized</div>;

  return (
    <div>
      <Header />
      <main style={{maxWidth:1100,margin:'18px auto',padding:16}}>
        <h2>Admin Dashboard <span style={{color:'#ffd700'}}>★</span></h2>
        <div style={{display:'flex',gap:12,marginTop:12}}>
          <div style={{flex:1}} className="card">
            <h3>Stats</h3>
            <p>Total Users: {users.length}</p>
            <p>Total Posts: {posts.length}</p>
          </div>
          <div style={{flex:2}} className="card">
            <h3>Post Announcement</h3>
            <textarea value={announcement} onChange={e=>setAnnouncement(e.target.value)} className="input" />
            <button onClick={postAnnouncement} className="btn" style={{marginTop:8}}>Post Announcement</button>
          </div>
        </div>
        <section style={{marginTop:12}}>
          <h3>Users</h3>
          <div style={{display:'grid',gap:6}}>
            {users.map(u=> <div key={u.uid} className="card">{u.username} — {u.email} {u.isAdmin && <strong> (admin)</strong>}</div>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
    }
