import { useEffect } from "react";

export default function PremiumAnimation() {
  useEffect(() => {
    const container = document.getElementById("premium-bg");
    if (!container) return;

    const colors = [
      "rgba(255, 105, 180, 0.4)", // hot pink
      "rgba(255, 215, 0, 0.4)",   // gold
      "rgba(255, 69, 0, 0.4)",    // red-orange
      "rgba(173, 216, 230, 0.4)", // light blue
    ];

    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.className = "premium-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${6 + Math.random() * 14}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDuration = `${6 + Math.random() * 8}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      id="premium-bg"
      className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none"
    >
      <style jsx>{`
        .premium-particle {
          position: absolute;
          border-radius: 50%;
          animation-name: floaty;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: blur(2px);
        }

        @keyframes floaty {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-60px) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
