import { useEffect } from "react";

const EMOJIS = ["🌹","😹","💬","💔","⚡️","🌚","✨","🔥","🎉","🌊","💫"];

export default function ParticleBackground() {
  useEffect(() => {
    const container = document.createElement("div");
    container.className = "particles";
    document.body.appendChild(container);

    let interval = setInterval(() => {
      const el = document.createElement("div");
      el.className = "particle";
      el.style.left = Math.random() * 100 + "%";
      el.style.fontSize = 12 + Math.random() * 26 + "px";
      el.style.animationDuration = 6 + Math.random() * 8 + "s";
      el.style.top = 85 + Math.random() * 15 + "%";
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      container.appendChild(el);
      setTimeout(() => el.remove(), 16000);
    }, 700);

    return () => {
      clearInterval(interval);
      container.remove();
    };
  }, []);

  return null;
}
