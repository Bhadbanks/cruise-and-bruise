// src/components/Header.js
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Header() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/logo.png" alt="logo" style={{width:56,height:56,borderRadius:12}} />
        <div>
          <div style={{fontWeight:800}}>👑✨💥 Special Squad 💥✨👑</div>
          <div style={{fontSize:12,color:'#d7cfe2'}}>Cruise & Bruise • Social Hub</div>
        </div>
      </div>
      <nav style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link href="/"><a>Home</a></Link>
        <Link href="/members"><a>Members</a></Link>
        {user ? (
          <>
            <Link href={`/profile/${user.displayName || user.email.split('@')[0]}`}><a>Profile</a></Link>
            <button onClick={logout} className="btn">Logout</button>
          </>
        ) : (
          <Link href="/login"><a className="btn">Login / Register</a></Link>
        )}
      </nav>
    </header>
  );
}
