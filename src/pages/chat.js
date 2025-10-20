import Navbar from "../components/Navbar";
import Chat from "../components/Chat";

export default function ChatPage(){
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Cruise & Bruise — Live Chat</h1>
        <ChatBox />
      </main>
    </div>
  );
}
