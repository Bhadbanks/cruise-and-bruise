import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { db } from "../../utils/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import PostCard from "../../components/PostCard";

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!username) return;
    async function fetchUser() {
      const q = query(collection(db, "users"), where("username", "==", username));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setUserData(data);
        const postsSnap = await getDocs(query(collection(db, "posts"), where("uid", "==", snap.docs[0].id)));
        setPosts(postsSnap.docs.map(p => ({ id: p.id, ...p.data() })));
      }
    }
    fetchUser();
  }, [username]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50">
      <Header currentUser={{ username: userData.username }} />
      <main className="max-w-4xl mx-auto p-4 mt-24">
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold">{userData.username} {userData.verified && <span className="text-yellow-400">★</span>}</h2>
          <p>{userData.bio}</p>
          <p>Followers: {userData.followers?.length || 0} | Following: {userData.following?.length || 0}</p>
        </div>
        <h3 className="text-xl font-bold mb-2">Posts</h3>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </main>
      <Footer />
    </div>
  );
}
