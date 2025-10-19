import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

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
  }

  return (
    <div className="bg-[#220022] p-8 rounded-xl shadow-lg w-full max-w-md animate-pulseSlow">
      <h2 className="text-2xl mb-4">{isRegister ? "Register" : "Login"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <p className="mt-4 text-sm cursor-pointer" onClick={()=>setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "No account? Register"}
      </p>
    </div>
  )
    }
