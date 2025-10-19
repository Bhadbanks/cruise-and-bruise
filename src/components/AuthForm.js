import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="p-2 rounded"/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="p-2 rounded"/>
      <button type="submit" className="bg-pink-600 text-white py-2 rounded font-bold">
        {isRegister ? "Register" : "Login"}
      </button>
      <p className="text-sm text-center cursor-pointer text-accent hover:underline" onClick={()=>setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </form>
  );
    }
