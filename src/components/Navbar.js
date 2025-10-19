import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  return (
    <header className="w-full max-w-5xl mx-auto p-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <div className="logo-box">
          <img src="/logo.png" alt="logo" width={48} height={48} style={{borderRadius:8}} />
        </div>
        <div>
          <div className="text-white font-bold">𝐂𝐫𝐮𝐢𝐬𝐞🌹 𝐚𝐧𝐝 𝐁𝐫𝐮𝐢𝐬𝐞 😹💬💔</div>
          <div className="text-sm text-gray-300">Cruise the chat. Bruise the boredom.</div>
        </div>
      </div>

      <nav className="flex items-center gap-3">
        <Link href="/"><a className="text-sm">Home</a></Link>
        <Link href="/chat"><a className="text-sm">Chat</a></Link>
        <Link href="/members"><a className="text-sm">Members</a></Link>
        <a className="btn-accent" href="https://wa.me/2348082591190" target="_blank" rel="noreferrer">Contact Admin</a>
        {user ? (
          <button className="ml-2 px-3 py-1 rounded bg-[#330033]" onClick={() => signOut(auth)}>Logout</button>
        ) : (
          <Link href="/"><a className="ml-2 px-3 py-1 rounded bg-[#330033]">Login</a></Link>
        )}
      </nav>
    </header>
  );
  }
