export default function Footer() {
  return (
    <footer className="mt-20 py-8 bg-gradient-to-r from-pink-50 via-yellow-50 to-red-50 text-center border-t border-pink-200">
      <p className="text-gray-700 font-medium">
        © {new Date().getFullYear()} <span className="text-pink-600 font-bold">Special Squad</span> — Built with 🤍 by ༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻
        <a
          href="https://wa.me/2348082591190"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:underline"
        >
          GC Dev
        </a>
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href="https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz?mode=ems_copy_t"
          target="_blank"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Join GC 💬
        </a>
        <a
          href="https://wa.me/2348082591190"
          target="_blank"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          Contact Owner 📞
        </a>
      </div>
    </footer>
  );
}
