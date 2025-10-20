// src/components/UserCard.js
import Link from "next/link";
export default function UserCard({ user }) {
  return (
    <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <img src={user.avatar || `/logo.png`} style={{width:56,height:56,borderRadius:10}} />
        <div>
          <div style={{fontWeight:700}}>{user.username} {user.isAdmin && <span style={{color:'#ffd700'}}>★</span>}</div>
          <div style={{fontSize:12,color:'#cbbdd8'}}>{user.bio || ''}</div>
        </div>
      </div>
      <div>
        <Link href={`/profile/${user.username}`}><a className="btn">View</a></Link>
      </div>
    </div>
  );
   }
