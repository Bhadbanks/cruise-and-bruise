import { useState,useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Admin(){
  const router = useRouter();
  const [announcement,setAnnouncement] = useState("");

  useEffect(()=>{
    if(!auth.currentUser || auth.currentUser.email!=="lowkey@admin.com") router.push("/");
  },[]);

  const postAnnouncement = async ()=>{
    if(!announcement) return;
    await addDoc(collection(db,"announcements"),{text:announcement,timestamp:new Date()});
    setAnnouncement("");
    alert("Announcement posted");
  }

  return(
    <div className="flex flex-col items-center gap-4 p-4 text-white">
      <h1 className="text-3xl font-bold text-accent">Admin Panel</h1>
      <input className="p-2 rounded bg-[#330033]" placeholder="Announcement" value={announcement} onChange={e=>setAnnouncement(e.target.value)}/>
      <button onClick={postAnnouncement} className="bg-primary px-6 py-2 rounded hover:bg-accent">Post Announcement</button>
    </div>
  )
}
