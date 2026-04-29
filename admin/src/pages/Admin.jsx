import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Admin() {
  const { user, users, updateProfile, changePassword, createUser, deleteUser } =
    useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    nextPassword: "",
  });
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showSuccess = (text) => {
    setMessage(text);
    setError("");
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  const submitProfile = (e) => {
    e.preventDefault();
    try {
      updateProfile(profileForm);
      showSuccess("Profile updated.");
    } catch (err) {
      showError(err?.message || "Failed to update profile.");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", nextPassword: "" });
      showSuccess("Password changed.");
    } catch (err) {
      showError(err?.message || "Failed to change password.");
    }
  };

  const submitCreateAccount = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showError("Only super admin can create accounts.");
      return;
    }

    setCreatingAccount(true);
    try {
      await createUser(accountForm);
      setAccountForm({ name: "", email: "", password: "" });
      showSuccess("Editor account created.");
    } catch (err) {
      showError(err?.message || "Failed to create account.");
    } finally {
      setCreatingAccount(false);
    }
  };

  const removeUser = async (item) => {
    if (!isSuperAdmin || item.role !== "editor") {
      showError("Only super admin can delete editor accounts.");
      return;
    }

    const confirmed = window.confirm(
      `Delete editor account "${item.name}" (${item.email || item.id})?`,
    );
    if (!confirmed) return;

    try {
      await deleteUser(item.id);
      showSuccess("Editor account deleted.");
    } catch (err) {
      showError(err?.message || "Failed to delete account.");
    }
  };

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5 sm:p-6">
        <h2 className="text-3xl font-bold text-white">Admin Settings</h2>
      </header>

      {message ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <form
          onSubmit={submitProfile}
          className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5"
        >
          <h3 className="text-lg font-semibold text-white">Profile</h3>
          <div>
            <label className="mb-1 block text-sm text-white/80">Name</label>
            <input
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Email</label>
            <input
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)]"
          >
            Save Profile
          </button>
        </form>

        <form
          onSubmit={submitPassword}
          className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5"
        >
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <div>
            <label className="mb-1 block text-sm text-white/80">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.nextPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  nextPassword: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)]"
          >
            Change Password
          </button>
        </form>

      </div>

      {isSuperAdmin ? (
        <form
          onSubmit={submitCreateAccount}
          className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5"
        >
          <h3 className="text-lg font-semibold text-white">Create New Account</h3>
          <p className="text-sm text-white/70">
            Only super admin can create account. New accounts are always created
            as editor.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              value={accountForm.name}
              onChange={(e) =>
                setAccountForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Editor name"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/40 disabled:opacity-70"
              required
              disabled={creatingAccount}
            />
            <input
              type="email"
              value={accountForm.email}
              onChange={(e) =>
                setAccountForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="editor@email.com"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/40 disabled:opacity-70"
              required
              disabled={creatingAccount}
            />
            <input
              type="password"
              value={accountForm.password}
              onChange={(e) =>
                setAccountForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/40 disabled:opacity-70"
              required
              disabled={creatingAccount}
            />
          </div>

          <button
            type="submit"
            disabled={creatingAccount}
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {creatingAccount ? "Creating..." : "Create Editor Account"}
          </button>
        </form>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5">
        <h3 className="mb-3 text-lg font-semibold text-white">Admin Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/60">
                <th className="px-2 py-2 font-medium">ID</th>
                <th className="px-2 py-2 font-medium">Name</th>
                <th className="px-2 py-2 font-medium">Email</th>
                <th className="px-2 py-2 font-medium">Role</th>
                <th className="px-2 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 text-white/85"
                >
                  <td className="px-2 py-2">{item.id}</td>
                  <td className="px-2 py-2">{item.name}</td>
                  <td className="px-2 py-2">{item.email || "-"}</td>
                  <td className="px-2 py-2">{item.role}</td>
                  <td className="px-2 py-2">
                    {isSuperAdmin && item.role === "editor" ? (
                      <button
                        type="button"
                        onClick={() => removeUser(item)}
                        className="rounded-md border border-red-400/35 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
