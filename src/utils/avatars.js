export const generateAvatar = (username) => {
  return `https://avatars.dicebear.com/api/bottts/${encodeURIComponent(username)}.svg`;
};
