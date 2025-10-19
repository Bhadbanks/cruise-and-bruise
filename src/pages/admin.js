import { useState } from "react";
import AdminPanel from "../components/AdminPanel";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const ADMIN_PASS = "lowkey123"; // hardcoded admin

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#220022] p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Admin Login</h2>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="mb-2"/>
        <button onClick={()=>{ if(password===ADMIN_PASS) setLoggedIn(true)}}>Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center pt-8">
      <h1 className="text-3xl mb-4">Admin Panel</h1>
      <AdminPanel />
    </div>
  );
    }
