// src/components/PostCard.js
export default function PostCard({ post }) {
  return (
    <div className="card" style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{post.authorName}</div>
          <div style={{fontSize:12,color:'#cbbdd8'}}>{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div style={{marginTop:8}}>{post.content}</div>
      <div style={{marginTop:10,fontSize:13,color:'#cbbdd8'}}>&nbsp;❤️ {post.likes?.length || 0} &nbsp; 💬 {post.comments?.length || 0}</div>
    </div>
  );
}
