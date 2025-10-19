import { useEffect } from "react";

/* NOTE: ParticleBackground - creates floating emoji particles.
   They spawn at bottom of screen and float higher before disappearing.
   You can change EMOJIS or spawn rate below. */
const EMOJIS = ["🌹","😹","💬","💔","✨","🔥","🎉","🌊","💫"];

export default function ParticleBackground() {
  useEffect(() => {
    const container = document.createElement("div");
    container.className = "particles";
    document.body.appendChild(container);

    const spawn = () => {
      const el = document.createElement("div");
      el.className = "particle";
      el.style.left = Math.random() * 100 + "%";
      el.style.fontSize = 14 + Math.random() * 34 + "px";
      el.style.animationDuration = 8 + Math.random() * 12 + "s"; // float longer
      el.style.top = 92 + Math.random() * 6 + "%"; // start lower (near bottom)
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      container.appendChild(el);
      setTimeout(() => el.remove(), 30000);
    };

    const iv = setInterval(spawn, 550);
    return () => { clearInterval(iv); container.remove(); };
  }, []);

  return null;
}
