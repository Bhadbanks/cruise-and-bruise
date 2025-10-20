// src/pages/login.js
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login(){
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);

  const submit = async (e) => {
    e?.preventDefault();
    try{
      const cred = await signInWithEmailAndPassword(auth,email,password);
      // redirect admin to admin page
      if (cred.user.email === process.env.ADMIN_EMAIL) router.push('/admin');
      else router.push('/');
    }catch(error){
      setErr(error.message);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="card" style={{width:420}}>
        <h2>Login</h2>
        {err && <div style={{color:'red'}}>{err}</div>}
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
          }
