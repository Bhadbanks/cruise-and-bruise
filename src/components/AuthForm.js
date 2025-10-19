import { useState } from "react";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";

/* NOTE: AuthForm creates minimal user doc on register so presence works.
   It ensures redirect flow:
   - Register -> /profile (force completion)
   - Login -> /home (dashboard)
*/
export default function AuthForm({ onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const tidy = (s) => (s || "").trim();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, tidy(email), password);
        const displayName = tidy(email).split("@")[0];
        await updateProfile(cred.user, { displayName });
        await setDoc(doc(db,"users", cred.user.uid), {
          username: displayName,
          email: tidy(email),
          createdAt: serverTimestamp(),
          profileComplete: false,
          lastSeen: serverTimestamp()
        });
        router.push("/profile");
      } else {
        await signInWithEmailAndPassword(auth, tidy(email), password);
        router.push("/home");
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {error && <div className="text-red-300 text-sm">{error}</div>}

        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password (min 6)" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn-accent" type="submit">{isRegister ? "Create account" : "Login"}</button>
      </form>

      <div className="mt-3 flex justify-between items-center text-sm">
        <button onClick={() => setIsRegister(!isRegister)} className="text-accent1/90 underline">
          {isRegister ? "Have an account? Login" : "New? Register"}
        </button>
        <a href="https://wa.me/2348082591190" target="_blank" rel="noreferrer" className="underline">Contact Admin</a>
      </div>
    </div>
  );
    }
