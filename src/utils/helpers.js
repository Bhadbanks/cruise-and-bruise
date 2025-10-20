// src/utils/helpers.js
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

/* -------------------------
   POSTS & ANNOUNCEMENTS
   ------------------------- */

// Real-time listener for posts (caller provides callback)
export function onPostsSnapshot(cb) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function fetchPostsOnce() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createPost({ uid, username, text, type = "userPost" }) {
  return addDoc(collection(db, "posts"), {
    uid,
    username,
    text,
    type,
    likes: [],
    comments: [],
    createdAt: serverTimestamp(),
  });
}

/* -------------------------
   ANNOUNCEMENTS (admin)
   ------------------------- */

export function onAnnouncementsSnapshot(cb) {
  const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function createAnnouncement({ title, message, adminUid, adminName }) {
  return addDoc(collection(db, "announcements"), {
    title,
    message,
    adminUid,
    adminName,
    createdAt: serverTimestamp(),
    type: "announcement",
  });
}

/* -------------------------
   USERS
   ------------------------- */

export async function fetchUsersOnce() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUserByUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getUserByUid(uid) {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

export async function createOrUpdateUser(uid, data) {
  return setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/* -------------------------
   PUBLIC CHAT
   ------------------------- */

export function onPublicChat(cb) {
  const q = query(collection(db, "public_chat"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function sendPublicMessage({ uid, username, text }) {
  return addDoc(collection(db, "public_chat"), {
    uid,
    username,
    text,
    createdAt: serverTimestamp(),
  });
}

/* -------------------------
   NEWS (calls /api/news on client)
   ------------------------- */

export async function fetchNewsClient() {
  const res = await fetch("/api/news");
  if (!res.ok) return [];
  return res.json();
}
