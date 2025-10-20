// src/pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db, storage } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    hobby: "",
    sex: "",
    relationshipStatus: "",
    bio: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleFile = e => setFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parseInt(form.age) < 16) {
        setError("You must be 16+ to register");
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCred.user.uid;

      // upload avatar if provided
      let photoURL = "";
      if (file) {
        const storageRef = ref(storage, `avatars/${uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } else {
        // generate dicebear identicon (no cost)
        const seed = encodeURIComponent(form.username || form.email);
        photoURL = `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
      }

      // update auth displayName / photo
      await updateProfile(auth.currentUser, { displayName: form.username, photoURL });

      // save full profile in Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        username: form.username,
        email: form.email,
        age: form.age,
        hobby: form.hobby,
        sex: form.sex,
        relationshipStatus: form.relationshipStatus,
        bio: form.bio,
        photoURL,
        followers: [],
        following: [],
        createdAt: new Date(),
        mustHaveJoinedGC: true
      });

      // force GC join via opening link
      window.open(process.env.NEXT_PUBLIC_GC_LINK || process.env.GC_LINK, "_blank");
      alert(`Welcome ${form.username}! You were redirected to join the WhatsApp group. Finish joining to start chatting.`);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-50 via-red-50 to-yellow-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Create account — Special Squad</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <input name="hobby" placeholder="Hobby" value={form.hobby} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <select name="sex" value={form.sex} onChange={handleChange} className="mb-2 p-2 border rounded w-full">
            <option value="">Select Sex</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <select name="relationshipStatus" value={form.relationshipStatus} onChange={handleChange} className="mb-2 p-2 border rounded w-full">
            <option value="">Relationship Status</option>
            <option>Single</option><option>In a Relationship</option><option>Complicated</option>
          </select>
          <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="mb-2 p-2 border rounded w-full"/>
          <label className="block mb-2">
            Upload profile photo (optional)
            <input type="file" accept="image/*" onChange={handleFile} className="mt-1"/>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded">Register & Join GC</button>
            <a className="ml-2 text-sm text-gray-600 self-center" href="/login">Already have an account?</a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
            }
