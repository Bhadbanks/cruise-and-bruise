export default function UserCard({ user }) {
  return (
    <div className="profile-card mb-4">
      <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-full mb-2"/>
      <h3 className="text-lg font-bold">{user.username}</h3>
      <p className="text-sm">{user.bio}</p>
      <p className="text-xs">{user.location} • Age: {user.age}</p>
      <p className="text-xs">{user.hobby} • {user.sex} • {user.relationshipStatus}</p>
    </div>
  )
  }
