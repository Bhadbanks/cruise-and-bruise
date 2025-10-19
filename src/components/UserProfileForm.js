import { useState, useEffect } from "react";
import { auth, db, storage } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

function genAvatarUrl(seed){
  return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(seed)}.svg`;
}

export default function UserProfileForm(){ 
  const [form, setForm] = useState({
    username:"", bio:"", location:"", age:"", hobby:"", sex:"", relationshipStatus:""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(()=> {
    // if already authed, try prefill email/username
    const u = auth.currentUser;
    if(u && !form.username) setForm(f=>({...f, username: u.email ? u.email.split("@")[0] : ""}));
  }, []);

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username) { setError("Choose a username"); return; }
    if (!form.age || parseInt(form.age) < 16) { setError("You must be 16+ to register"); return; }
    try {
      let photoURL = null;
      if (file) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } else {
        photoURL = genAvatarUrl(form.username || auth.currentUser.email || "user");
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: form.username,
        bio: form.bio,
        location: form.location,
        age: parseInt(form.age),
        hobby: form.hobby,
        sex: form.sex,
        relationshipStatus: form.relationshipStatus,
        photoURL,
        email: auth.currentUser.email,
        updatedAt: new Date().toISOString()
      });

      router.push("/chat"); // done -> go to chat
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Complete your profile</h2>
      {error && <div className="text-red-300 mb-2">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input name="username" placeholder="Username" value={form.username} onChange={handle} />
        <input name="location" placeholder="Location" value={form.location} onChange={handle} />
        <input name="age" placeholder="Age" value={form.age} onChange={handle} type="number" />
        <input name="hobby" placeholder="Hobby" value={form.hobby} onChange={handle} />
        <select name="sex" value={form.sex} onChange={handle} required>
          <option value="">Select Sex</option>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <select name="relationshipStatus" value={form.relationshipStatus} onChange={handle}>
          <option value="">Relationship status</option>
          <option>Single</option><option>In a Relationship</option><option>Complicated</option>
        </select>
        <textarea name="bio" placeholder="Short bio" value={form.bio} onChange={handle}/>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/>
        <button className="btn-accent" type="submit">Save profile</button>
      </form>
    </div>
  );
        }
