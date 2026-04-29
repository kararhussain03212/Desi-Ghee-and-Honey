export default function UserTable({
  users,
  loading,
  canEditUsers,
  canDeleteUsers,
  onView,
  onEdit,
  onDelete,
}) {
  const resolveProfilePhoto = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const apiRoot = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    if (!apiRoot) return raw;
    if (raw.startsWith("/")) return `${apiRoot}${raw}`;
    return `${apiRoot}/uploads/${raw}`;
  };

  const formatDateTime = (value) => {
    if (!value) return "Never";
    const date = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  const getInitials = (name = "") =>
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";

  if (loading) return <p className="text-white/70">Loading users...</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
      <table className="min-w-full divide-y divide-[var(--admin-border)] text-sm">
        <thead className="bg-[var(--admin-bg)] text-left text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
          <tr>
            <th className="px-4 py-4">Name</th>
            <th className="px-4 py-4">Email</th>
            <th className="px-4 py-4">Role</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Last Login</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-white/70">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id || user.id}>
                <td className="px-4 py-4 text-white">
                  <div className="flex items-center gap-3">
                    {resolveProfilePhoto(user.profile_photo) ? (
                      <img
                        src={resolveProfilePhoto(user.profile_photo)}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full border border-[var(--admin-border)] object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[#ffc107] text-sm font-bold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-[var(--admin-muted)]">Joined {formatDateTime(user.created_at)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/85">{user.email}</td>
                <td className="px-4 py-3 text-white/85">
                  <span className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-2.5 py-1 text-xs font-semibold capitalize">{user.role}</span>
                  {user.is_super_admin ? (
                    <span className="ml-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">Super Admin</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-white/85">
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 capitalize">{user.status}</span>
                </td>
                <td className="px-4 py-3 text-white/85">{formatDateTime(user.last_login_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onView(user)} className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-1.5 text-white/90">View</button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      disabled={!canEditUsers || user.is_super_admin}
                      title={user.is_super_admin ? "Super admin is protected" : ""}
                      className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-3 py-1.5 text-blue-200 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      disabled={!canDeleteUsers || user.is_super_admin}
                      title={user.is_super_admin ? "Super admin is protected" : ""}
                      className="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-red-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
