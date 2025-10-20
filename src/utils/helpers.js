// src/utils/helpers.js
import { db } from "./firebase";
import {
  collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, updateDoc, where
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Create user profile in Firestore (call after sign-up)
export async function createUserProfile(uid, username, email, extra = {}) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid,
    username,
    email,
    avatar: `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(username)}.svg`,
    bio: extra.bio || "",
    age: extra.age || null,
    whatsapp: extra.whatsapp || "",
    sex: extra.sex || "",
    relationshipStatus: extra.relationshipStatus || "",
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
    isAdmin: (email === process.env.ADMIN_EMAIL)
  });
}

export async function getUserByUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const all = snap.docs.map(d => d.data());
  return all.find(u => u.username && u.username.toLowerCase() === (username||"").toLowerCase()) || null;
}

export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => d.data());
}

export async function createPost(uid, username, content) {
  const postsCol = collection(db, "posts");
  await addDoc(postsCol, {
    id: uuidv4(),
    uid,
    authorName: username,
    content,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: []
  });
}

export async function getPosts(limit = 50) {
  const snap = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => d.data()).slice(0, limit);
}

export async function fetchNewsServer() {
  const key = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || process.env.NEXT_PUBLIC_NEWS_API;
  if (!key) return [];
  const res = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&pageSize=6&apiKey=${key}`);
  const json = await res.json();
  return json.articles || [];
}
