// src/components/Footer.js
export default function Footer(){
  return (
    <footer className="footer" style={{marginTop:24,textAlign:'center'}}>
      <div>Made with ♥ by ༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻ — <a href="https://wa.me/2348082591190">Contact</a></div>
      <div style={{marginTop:6,fontSize:12}}>Join GC: <a href={process.env.WHATSAPP_GROUP || process.env.NEXT_PUBLIC_WHATSAPP_GROUP} target="_blank" rel="noreferrer">WhatsApp Group</a></div>
    </footer>
  );
}
