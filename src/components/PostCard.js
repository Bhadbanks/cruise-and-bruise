export default function PostCard({ post }) {
  return (
    <div className="border rounded p-4 shadow-md bg-white dark:bg-gray-800 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{post.username} {post.verified && <span className="text-yellow-400">★</span>}</span>
        <span className="text-xs text-gray-500">{new Date(post.createdAt.toDate()).toLocaleString()}</span>
      </div>
      <p className="mb-2">{post.content}</p>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>❤️ {post.likes?.length || 0}</span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>
    </div>
  );
}
