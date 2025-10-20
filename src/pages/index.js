// src/pages/index.js
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsFeed from "../components/NewsFeed";
import FloatingParticles from "../components/FloatingParticles";
import Chat from "../components/Chat";
import { getPosts } from "../utils/helpers";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    (async ()=> {
      const p = await getPosts();
      setPosts(p);
    })();
  }, []);

  return (
    <div>
      <FloatingParticles />
      <Header />
      <main style={{maxWidth:1100,margin:'24px auto',padding:'0 16px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
        <section>
          <NewsFeed posts={posts} />
        </section>
        <aside>
          <Chat />
          <div className="card" style={{marginTop:12}}>
            <h3>Admin Announcements</h3>
            <p>Announcements posted by admin appear across the site.</p>
            <a className="btn" href={process.env.WHATSAPP_GROUP} target="_blank" rel="noreferrer">Join WhatsApp</a>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
  }
