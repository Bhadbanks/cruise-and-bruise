import { useState } from "react";
import { auth, db, storage } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserProfileForm({ onComplete }) {
  const [form, setForm] = useState({
    username: "",
    bio: "",
    location: "",
    age: "",
    hobby: "",
    sex: "",
    relationshipStatus: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(form.age) < 16) {
      return setError("You must be 16+ to register");
    }

    let photoURL = null;

    try {
      if (file) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } else {
        const seed = encodeURIComponent(form.username || auth.currentUser.email);
        photoURL = `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...form,
        photoURL,
        email: auth.currentUser.email
      });

      onComplete(); // ✅ call parent callback after saving
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#220022] p-6 rounded-xl w-full max-w-md shadow-lg">
      <h2 className="text-xl mb-4">Complete Your Profile</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          name="hobby"
          placeholder="Hobby"
          value={form.hobby}
          onChange={handleChange}
        />
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          required
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="relationshipStatus"
          value={form.relationshipStatus}
          onChange={handleChange}
        >
          <option value="">Relationship Status</option>
          <option value="Single">Single</option>
          <option value="In a Relationship">In a Relationship</option>
          <option value="Complicated">Complicated</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button type="submit" className="mt-2">
          Save Profile
        </button>
      </form>
    </div>
  );
}
