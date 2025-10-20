import Link from "next/link";

export default function UserCard({ user }) {
  return (
    <div className="border rounded p-3 shadow hover:shadow-lg transition flex justify-between items-center bg-white dark:bg-gray-800 mb-2">
      <div>
        <p className="font-bold">{user.username} {user.verified && <span className="text-yellow-400">★</span>}</p>
        <p className="text-sm text-gray-500">{user.bio || "No bio"}</p>
      </div>
      <Link href={`/profile/${user.username}`} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">
        View
      </Link>
    </div>
  );
}
