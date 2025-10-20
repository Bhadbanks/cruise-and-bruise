// src/pages/profile/[username].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getUserByUsername, getPosts } from "../../utils/helpers";
import PostCard from "../../components/PostCard";

export default function ProfilePage(){
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    if (!username) return;
    (async ()=>{
      const u = await getUserByUsername(username);
      setUser(u);
      const all = await getPosts();
      setPosts(all.filter(p => p.uid === u?.uid));
    })();
  }, [username]);

  if (!user) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div>
      <Header />
      <main style={{maxWidth:900,margin:'18px auto',padding:16}}>
        <div className="card">
          <h2>{user.username} {user.isAdmin && <span style={{color:'#ffd700'}}>★</span>}</h2>
          <p>{user.bio}</p>
          <p>Age: {user.age || '-'}</p>
          <p>WhatsApp: {user.whatsapp || '-'}</p>
          <p>Followers: {user.followers?.length || 0} | Following: {user.following?.length || 0}</p>
        </div>
        <section style={{marginTop:12}}>
          <h3>Posts</h3>
          {posts.length===0 ? <p>No posts</p> : posts.map(p => <PostCard key={p.id} post={p}/>)}
        </section>
      </main>
      <Footer />
    </div>
  );
}
