import { useState, useEffect } from "react";
import { auth, db, storage } from "../utils/firebase";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { generateAvatar } from "../utils/avatars";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    age: "",
    bio: "",
    location: "",
    hobby: "",
    sex: "",
    relationship: "",
    avatar: ""
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) router.push("/");
  }, []);

  const handleSubmit = async () => {
    if(userData.age < 16) return alert("You must be 16 or older to register.");
    let avatarUrl = file ? await uploadFile(file) : generateAvatar(userData.username);
    await setDoc(doc(db, "users", auth.currentUser.uid), {...userData, avatar: avatarUrl});
    router.push("/chat");
  };

  const uploadFile = async (file) => {
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Complete Your Profile</h1>
      {["username","age","bio","location","hobby","sex","relationship"].map((f)=>(
        <input key={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
          value={userData[f]}
          onChange={e=>setUserData({...userData,[f]: e.target.value})}
          className="p-2 rounded w-80"
          type={f==="age"?"number":"text"}
        />
      ))}
      <input type="file" onChange={e=>setFile(e.target.files[0])}/>
      <button onClick={handleSubmit} className="bg-primary px-6 py-2 rounded hover:bg-accent">Save Profile</button>
    </div>
  );
                 }
