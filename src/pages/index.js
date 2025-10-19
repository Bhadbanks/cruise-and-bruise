import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function Home() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [isRegister,setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if(isRegister){
        await createUserWithEmailAndPassword(auth,email,password);
      } else{
        await signInWithEmailAndPassword(auth,email,password);
      }
      router.push("/profile");
    } catch(err){
      alert(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-[#110011] via-[#220022] to-[#330033] text-white">
      <img src="/logo.png" className="w-36 mb-4"/>
      <h1 className="text-5xl font-bold text-accent">𝐂𝐫𝐮𝐢𝐬𝐞🌹 𝐚𝐧𝐝 𝐁𝐫𝐮𝐢𝐬𝐞 😹💬💔</h1>
      <input type="email" placeholder="Email" className="p-2 rounded bg-[#330033] text-white" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" className="p-2 rounded bg-[#330033] text-white" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button onClick={handleAuth} className="bg-primary px-6 py-2 rounded hover:bg-accent transition">{isRegister ? "Register" : "Login"}</button>
      <p className="cursor-pointer" onClick={()=>setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  )
    }
