export function exportUsersCSV(users){
  const header = ['username','email','age','bio','photoURL','whatsapp','updatedAt'];
  const rows = users.map(u => header.map(k => u[k] ?? ""));
  const csv = [header, ...rows].map(r=> r.map(c=> `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  return csv;
}
