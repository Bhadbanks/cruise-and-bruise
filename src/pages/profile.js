import Navbar from "../components/Navbar";
import UserProfileForm from "../components/UserProfileForm";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Profile(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u => {
      if(!u) { setUser(null); return; }
      const snap = await getDoc(doc(db,"users",u.uid));
      setUser(snap.exists() ? snap.data() : null);
    });
    return unsub;
  },[]);
  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {!user ? <UserProfileForm /> : (
          <div className="card">
            <h2 className="text-xl font-bold">Your Profile</h2>
            <div className="flex gap-4 items-center mt-4">
              <img src={user.photoURL} className="avatar" alt="avatar"/>
              <div>
                <div className="font-bold text-lg">{user.username}</div>
                <div className="text-sm opacity-80">Age: {user.age}</div>
                <div className="mt-2">{user.bio}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
          }
