import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date(),
        verified: false,
        badge: "member",
      });

      localStorage.setItem("joinedGC", "false");
      alert(`🎉 Welcome to Special Squad, ${username}!`);
      router.push("/");
    } catch (err) {
      setError("⚠️ Registration failed. Try again with a valid email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-red-50 to-pink-100 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-40 animate-ping"></div>
      </div>

      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-2">Join the Squad 💫</h1>
        <p className="text-gray-600 mb-6">Create your Special Squad account</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-3 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
          }
