import { useEffect } from "react";

export default function FloatingAnimation() {
  useEffect(() => {
    const container = document.getElementById("floating-container");
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "float-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;
      container.appendChild(particle);
    }
  }, []);

  return (
    <div id="floating-container" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <style jsx>{`
        .float-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 192, 203, 0.7);
          border-radius: 50%;
          animation-name: floatAnim;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes floatAnim {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-60px) rotate(180deg); opacity: 0.5; }
          100% { transform: translateY(0) rotate(360deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
