import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

export default function ChatPage(){
  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Cruise & Bruise — Live Chat</h1>
        <ChatBox />
      </main>
    </div>
  );
}
