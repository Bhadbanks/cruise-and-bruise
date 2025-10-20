export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 text-white p-4 text-center shadow-inner mt-6">
      <p>
        Made with 🤍 by ༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻ | WhatsApp: 
        <a href={process.env.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline ml-1">
          Contact Me
        </a> | Join GC: 
        <a href={process.env.GC_LINK} target="_blank" rel="noopener noreferrer" className="underline ml-1">
          Special Squad GC
        </a>
      </p>
      <p className="mt-1 text-sm">© 2025 Special Squad Social. All Rights Reserved.</p>
    </footer>
  );
  }
