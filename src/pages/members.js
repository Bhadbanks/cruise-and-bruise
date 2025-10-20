// src/pages/members.js
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserCard from "../components/UserCard";
import { getAllUsers } from "../utils/helpers";

export default function MembersPage(){
  const [users, setUsers] = useState([]);
  const [search,setSearch] = useState('');

  useEffect(()=> {
    (async ()=> {
      const u = await getAllUsers();
      setUsers(u);
    })();
  }, []);

  const filtered = users.filter(x => x.username?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Header />
      <main style={{maxWidth:1000,margin:'18px auto',padding:16}}>
        <div className="card" style={{marginBottom:12}}>
          <input placeholder="Search members..." value={search} onChange={e=>setSearch(e.target.value)} className="input" />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
          {filtered.map(u => <UserCard key={u.uid || u.username} user={u} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
