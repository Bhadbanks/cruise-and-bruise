// src/components/FloatingParticles.js
import { useEffect } from "react";

export default function FloatingParticles(){
  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '0';
    document.body.appendChild(container);

    const emojis = ["💥","✨","👑","🔥","😹","🎉","💫","🌹"];
    const spawn = () => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.position = 'absolute';
      el.style.left = Math.random()*100 + '%';
      el.style.top = 90 + Math.random()*10 + '%';
      el.style.fontSize = 12 + Math.random()*26 + 'px';
      el.style.opacity = (0.5 + Math.random()*0.5).toString();
      el.style.transition = 'transform 10s linear, opacity 10s linear';
      container.appendChild(el);
      requestAnimationFrame(()=> el.style.transform = 'translateY(-120vh) rotate(360deg)');
      setTimeout(()=> el.remove(), 11000);
    };

    const interval = setInterval(spawn, 700);
    return () => { clearInterval(interval); container.remove(); };
  }, []);
  return null;
         }
