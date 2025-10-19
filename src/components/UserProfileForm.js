import { useState, useEffect } from "react";
import { auth, db, storage } from "../utils/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

/* NOTE:
   UserProfileForm writes a full profile doc to users/{uid}.
   After saving it sets profileComplete=true and redirects to /home.
*/
function genAvatar(seed){ return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(seed)}.svg`; }

export default function UserProfileForm(){
  const [form, setForm] = useState({
    username: "", whatsapp: "", bio: "", location: "", age: "", hobby: "", sex: "", relationshipStatus: "", interests: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(()=> {
    if (auth.currentUser && !form.username){
      const pre = auth.currentUser.displayName || (auth.currentUser.email && auth.currentUser.email.split("@")[0]) || "";
      setForm(f=>({...f, username: pre}));
      (async ()=>{
        const snap = await getDoc(doc(db,"users", auth.currentUser.uid));
        if(snap.exists()){
          const d = snap.data();
          setForm(f=>({ ...f, ...d }));
        }
      })();
    }
  }, []);

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if(!form.username) return setError("Choose a username");
    if(!form.age || parseInt(form.age) < 16) return setError("You must be 16+ to register");
    try {
      let photoURL = null;
      if(file){
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } else {
        photoURL = genAvatar(form.username || auth.currentUser.uid);
      }

      await setDoc(doc(db,"users", auth.currentUser.uid), {
        username: form.username,
        whatsapp: form.whatsapp,
        bio: form.bio,
        location: form.location,
        age: parseInt(form.age),
        hobby: form.hobby,
        sex: form.sex,
        relationshipStatus: form.relationshipStatus,
        interests: form.interests,
        photoURL,
        email: auth.currentUser.email,
        profileComplete: true,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge:true });

      // show join GC CTA modal or redirect to chat
      router.push("/home");
    } catch(err){
      setError(err.message);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Complete your profile</h2>
      {error && <div className="text-red-300 mb-2">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="input" name="username" placeholder="Visible username" value={form.username} onChange={handle} />
        <input className="input" name="whatsapp" placeholder="WhatsApp number (+234...)" value={form.whatsapp} onChange={handle} />
        <input className="input" name="age" type="number" placeholder="Age" value={form.age} onChange={handle} />
        <select className="input" name="sex" value={form.sex} onChange={handle}>
          <option value="">Sex / Pronouns</option><option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input className="input" name="location" placeholder="Location" value={form.location} onChange={handle} />
        <input className="input" name="hobby" placeholder="Hobby" value={form.hobby} onChange={handle} />
        <input className="input" name="interests" placeholder="Interests (comma separated)" value={form.interests} onChange={handle} />
        <select className="input" name="relationshipStatus" value={form.relationshipStatus} onChange={handle}>
          <option value="">Relationship status</option><option>Single</option><option>In a relationship</option><option>Complicated</option>
        </select>
        <textarea className="input" name="bio" placeholder="Short bio" value={form.bio} onChange={handle} />
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
        <button className="btn-accent p-3 rounded font-bold" type="submit">Save profile & continue</button>
      </form>
    </div>
  );
        }
