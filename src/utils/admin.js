export function isAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
}
