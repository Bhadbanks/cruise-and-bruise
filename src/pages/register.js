// src/pages/register.js
import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createUserProfile } from "../utils/helpers";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register(){
  const router = useRouter();
  const [form,setForm] = useState({username:'',email:'',password:'',age:'',whatsapp:'',sex:'',relationshipStatus:'',bio:''});
  const [err,setErr] = useState(null);

  const change = (e) => setForm({...form,[e.target.name]:e.target.value});

  const submit = async (e) => {
    e?.preventDefault();
    if (parseInt(form.age || '0') < 16) { setErr("You must be 16+ to register"); return; }
    try{
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.username });
      await createUserProfile(cred.user.uid, form.username, form.email, {
        bio: form.bio, age: form.age, whatsapp: form.whatsapp, sex: form.sex, relationshipStatus: form.relationshipStatus
      });
      // Force join WhatsApp group
      window.open(process.env.WHATSAPP_GROUP, '_blank');
      router.push('/');
    }catch(error){
      setErr(error.message);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="card" style={{width:520}}>
        <h2>Register</h2>
        {err && <div style={{color:'red'}}>{err}</div>}
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input name="username" className="input" placeholder="Username" value={form.username} onChange={change} required/>
          <input name="email" className="input" placeholder="Email" value={form.email} onChange={change} required />
          <input name="password" className="input" placeholder="Password" type="password" value={form.password} onChange={change} required />
          <input name="age" className="input" placeholder="Age" type="number" value={form.age} onChange={change} />
          <input name="whatsapp" className="input" placeholder="WhatsApp number" value={form.whatsapp} onChange={change} />
          <select name="sex" className="input" value={form.sex} onChange={change}><option value="">Sex</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>
          <select name="relationshipStatus" className="input" value={form.relationshipStatus} onChange={change}><option value="">Relationship</option><option>Single</option><option>In a Relationship</option><option>Complicated</option></select>
          <textarea name="bio" placeholder="Short bio" value={form.bio} onChange={change} className="input" style={{gridColumn:'1 / -1'}}/>
          <button className="btn" style={{gridColumn:'1 / -1'}}>Register & Join GC</button>
        </form>
      </div>
    </div>
  );
          }
