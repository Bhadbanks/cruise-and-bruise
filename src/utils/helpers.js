import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Fetch news from NewsAPI
export async function fetchNews() {
  const res = await fetch(`/api/news`);
  const data = await res.json();
  return data.articles || [];
}

// Fetch all users
export async function fetchUsers() {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => doc.data());
}

// Get DMs between two users
export async function getDMs(userId) {
  const dmsCol = collection(db, "dms");
  const snapshot = await getDocs(query(dmsCol, where("participants", "array-contains", userId)));
  return snapshot.docs.map(doc => doc.data());
}

// Send DM
export async function sendDM(fromId, toId, message) {
  const dmsCol = collection(db, "dms");
  await addDoc(dmsCol, {
    participants: [fromId, toId],
    messages: [{ from: fromId, to: toId, message, createdAt: new Date().toISOString() }]
  });
}

// Add a post
export async function addPost(post) {
  const postsCol = collection(db, "posts");
  await addDoc(postsCol, post);
}

// Fetch all posts
export async function fetchPosts() {
  const postsCol = collection(db, "posts");
  const snapshot = await getDocs(postsCol);
  return snapshot.docs.map(doc => doc.data());
}
