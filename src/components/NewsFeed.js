// src/components/NewsFeed.js
import { useEffect, useState } from "react";
import { fetchNewsServer } from "../utils/helpers";

export default function NewsFeed({ posts = [] }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function get() {
      const a = await fetch('/api/news').then(r => r.json()).catch(()=>[]);
      setNews(a || []);
    }
    get();
  }, []);

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
      <div className="card">
        <h3>Recent Posts</h3>
        {posts.length===0 ? <p className="small-muted">No posts yet</p> : posts.map(p => <div key={p.id}><strong>{p.authorName}</strong><div>{p.content}</div><hr/></div>)}
      </div>
      <div className="card">
        <h3>Tech News</h3>
        {news.length===0 ? <p className="small-muted">No news</p> : news.slice(0,5).map((a,i)=>(<div key={i}><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a><div style={{fontSize:12,color:'#cbbdd8'}}>{a.source.name}</div><hr/></div>))}
      </div>
    </div>
  );
           }
