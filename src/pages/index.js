import Navbar from "../components/Navbar";
import ParticleBackground from "../components/ParticleBackground";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";

export default function Home(){
  return (
    <div>
      <ParticleBackground />
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <motion.div className="logo-box w-56 h-56 flex items-center justify-center rounded-xl mx-auto md:mx-0"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{type:"spring", stiffness:120}}>
              <img src="/logo.png" alt="logo" width="140" height="140" style={{borderRadius:12}} />
            </motion.div>

            <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="text-4xl font-bold mt-6">
              𝐂𝐫𝐮𝐢𝐬𝐞🌹 𝐚𝐧𝐝 𝐁𝐫𝐮𝐢𝐬𝐞 😹💬💔
            </motion.h1>
            <p className="mt-3 text-gray-300 max-w-md">
              A dark neon group chat for vibes, jokes, and chaos. Sign up, complete your profile, then head to chat.
            </p>

            <div className="mt-6 flex gap-3">
              <a className="btn-accent" href="/chat">Enter Chat</a>
              <a className="btn-accent" href="https://wa.me/2348082591190" target="_blank" rel="noreferrer">Contact Admin</a>
            </div>
          </div>

          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.9}} className="card">
            <h2 className="text-xl font-bold mb-2">Login / Register</h2>
            <AuthForm />
          </motion.div>
        </div>
      </main>
    </div>
  );
    }
