import { useState } from "react";
import { auth, db, storage } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserProfileForm({ onComplete }) {
  const [form, setForm] = useState({
    username: "",
    bio: "",
    location: "",
    age: "",
    hobby: "",
    sex: "",
    relationshipStatus: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    if (parseInt(form.age) < 16) return setError("You must be 16+ to register");

    let photoURL = null;

    try {
      if (file) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } else {
        const seed = encodeURIComponent(form.username || auth.currentUser.email);
        photoURL = `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...form,
        photoURL,
        email: auth.currentUser.email
      });

      onComplete();
    } catch(err) {
      setError(err.message);
    }
  }

  return (
    <div className="bg-[#330033] p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-3">
      <h2 className="text-xl font-bold text-pink-400 mb-2">Complete Your Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="p-2 rounded bg-[#220022] text-white"/>
        <input name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="p-2 rounded bg-[#220022] text-white"/>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="p-2 rounded bg-[#220022] text-white"/>
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required className="p-2 rounded bg-[#220022] text-white"/>
        <input name="hobby" placeholder="Hobby" value={form.hobby} onChange={handleChange} className="p-2 rounded bg-[#220022] text-white"/>
        <select name="sex" value={form.sex} onChange={handleChange} required className="p-2 rounded bg-[#220022] text-white">
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select name="relationshipStatus" value={form.relationshipStatus} onChange={handleChange} className="p-2 rounded bg-[#220022] text-white">
          <option value="">Relationship Status</option>
          <option value="Single">Single</option>
          <option value="In a Relationship">In a Relationship</option>
          <option value="Complicated">Complicated</option>
        </select>
        <input type="file" onChange={e=>setFile(e.target.files[0])} className="p-2 rounded bg-[#220022] text-white"/>
        <button type="submit" className="mt-2 bg-pink-600 py-2 rounded font-bold hover:bg-pink-500 transition-colors">Save Profile</button>
      </form>
    </div>
  )
        }
