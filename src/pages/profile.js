import { useState, useEffect } from "react";
import { auth, db, storage } from "../utils/firebase";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generateAvatar } from "../utils/avatars";

export default function Profile(){
  const router = useRouter();
  const [userData,setUserData] = useState({username:"",age:"",bio:"",location:"",hobby:"",sex:"",relationship:""});
  const [file,setFile] = useState(null);

  useEffect(()=>{if(!auth.currentUser) router.push("/");},[]);

  const handleSubmit = async ()=>{
    if(userData.age < 16){alert("You must be at least 16"); return;}
    let avatarUrl = file ? await uploadAvatar() : generateAvatar(userData.username);
    await setDoc(doc(db,"users",auth.currentUser.uid),{...userData, avatar:avatarUrl});
    router.push("/chat");
  }

  const uploadAvatar = async ()=>{
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(storageRef,file);
    return await getDownloadURL(storageRef);
  }

  return(
    <div className="flex flex-col items-center gap-4 p-4 text-white">
      <h1 className="text-3xl font-bold">Complete Your Profile</h1>
      {["username","age","bio","location","hobby","sex","relationship"].map(field=>(
        <input key={field} placeholder={field} className="p-2 rounded bg-[#330033]" value={userData[field]} onChange={e=>setUserData({...userData,[field]:e.target.value})}/>
      ))}
      <input type="file" onChange={e=>setFile(e.target.files[0])}/>
      <button onClick={handleSubmit} className="bg-primary px-6 py-2 rounded hover:bg-accent">Save Profile</button>
    </div>
  )
        }
