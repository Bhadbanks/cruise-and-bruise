import { useState } from "react";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        whatsapp,
        bio,
        verified: false,
        followers: [],
        following: [],
        createdAt: new Date()
      });
      alert(`Welcome ${username}! Please join our WhatsApp group.`);
      window.open("https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz?mode=ems_copy_t", "_blank");
      router.push("/");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-yellow-50 flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-center">
        <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600">
            Register & Join GC
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
              }
