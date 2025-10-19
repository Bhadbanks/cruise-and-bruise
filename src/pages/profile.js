import Navbar from "../components/Navbar";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import UserProfileForm from "../components/UserProfileForm";

export default function Profile(){
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u => {
      if(!u){ setUserDoc(null); setLoading(false); return; }
      const snap = await getDoc(doc(db,"users", u.uid));
      setUserDoc(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
    return unsub;
  },[]);

  if(loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {userDoc ? (
          <div className="card">
            <h2 className="text-xl font-bold">Your Profile</h2>
            <div className="flex gap-4 items-start mt-4">
              <img src={userDoc.photoURL} className="w-20 h-20 rounded" alt="a" />
              <div>
                <div className="font-bold text-lg">{userDoc.username}</div>
                <div className="text-sm opacity-80">Age: {userDoc.age}</div>
                <div className="mt-2">{userDoc.bio}</div>
                <div className="mt-3 text-xs">WhatsApp: {userDoc.whatsapp}</div>
              </div>
            </div>
          </div>
        ) : (
          <UserProfileForm />
        )}
      </main>
    </div>
  );
  }
