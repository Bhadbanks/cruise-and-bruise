import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (!u) router.push("/");
      else setUser(u);
    });
    return unsub;
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110011] via-[#220022] to-[#330033] flex flex-col items-center pt-8">
      <h1 className="text-3xl mb-4">Cruise & Bruise Chat</h1>
      <Chat />
    </div>
  )
}
