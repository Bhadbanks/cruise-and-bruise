import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function AuthForm({ onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess?.();
      // After auth, go to profile completion
      router.push("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {error && <div className="text-red-300 text-sm">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="p-2 rounded bg-transparent border border-white/5" required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 rounded bg-transparent border border-white/5" required />
        <button type="submit" className="btn-accent"> {isRegister ? "Register" : "Login"} </button>
      </form>

      <div className="mt-3 text-sm flex justify-between items-center">
        <button onClick={() => setIsRegister(!isRegister)} className="text-accent1/90 underline">
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </button>
        <a href="https://wa.me/2348082591190" target="_blank" rel="noreferrer" className="text-sm underline">Contact Admin</a>
      </div>
    </div>
  );
    }
