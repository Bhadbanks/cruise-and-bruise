import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

export default function Header({ currentUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-pink-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Special Squad ✨
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium">
            Home
          </Link>
          <Link href="/members" className="text-gray-700 hover:text-pink-600 font-medium">
            Members
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-pink-600 font-medium">
            Announcements
          </Link>
          {currentUser ? (
            <>
              <Link
                href={`/profile/${currentUser.username || "me"}`}
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-gradient-to-r from-pink-500 to-yellow-400 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-white bg-gradient-to-r from-pink-500 to-yellow-400 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
    }
