import { useEffect, useState } from "react";

export default function NewsTicker() {
  const [news, setNews] = useState([
    "Welcome to Cruise & Bruise! 🌹💬",
    "New members joined today!",
    "Admin: Keep the chat friendly! 😹💔"
  ]);

  return (
    <div className="w-full overflow-hidden bg-[#330033] p-2 rounded mb-4">
      <div className="marquee flex gap-8 text-accent">
        {news.map((n,i) => <span key={i}>{n}</span>)}
      </div>
    </div>
  );
}
