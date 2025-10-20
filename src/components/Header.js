import Link from "next/link";
import { useRouter } from "next/router";
import { isAdmin } from "..utils/admin;
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Header({ currentUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-4 flex justify-between items-center text-white shadow-md fixed w-full z-50">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        👑✨💥 Special Squad 💥✨👑
      </h1>
      <nav className="flex items-center gap-4">
        {currentUser ? (
          <>
            <Link href="/members" className="hover:underline">Members</Link>
            <Link href={`/profile/${currentUser.username}`} className="hover:underline">Profile</Link>
            <button onClick={handleLogout} className="bg-white text-pink-600 px-3 py-1 rounded font-semibold hover:bg-pink-100">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
          };

{isAdmin(currentUser) && <span className="text-yellow-400 ml-2">★</span>}
          }
