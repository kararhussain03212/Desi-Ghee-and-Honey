import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createService, getService, updateService } from "../../api/serviceApi";

const getInitialForm = () => ({
  title: "",
  description: "",
  icon: "",
  orderPosition: 0,
  status: "active",
});

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isEditMode) {
      setForm(getInitialForm());
      setLoading(false);
      setError("");
      return;
    }

    const loadService = async () => {
      try {
        const res = await getService(id);
        const item = res.data?.data || {};
        setForm({
          title: item.title || "",
          description: item.description || "",
          icon: item.icon || "",
          orderPosition: Number(item.order_position || 0),
          status: item.status === "inactive" ? "inactive" : "active",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load service.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Service title is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        order_position: Number(form.orderPosition || 0),
        status: form.status === "inactive" ? "inactive" : "active",
      };

      if (isEditMode) await updateService(id, payload);
      else await createService(payload);

      navigate("/services");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError("Session expired or invalid. Please login again.");
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white/70">Loading service...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Service" : "Add Service"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[#0d2a1b] p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Title</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[#123523] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Icon</label>
            <input
              value={form.icon}
              onChange={(e) => setField("icon", e.target.value)}
              placeholder="e.g. box, truck, leaf"
              className="w-full rounded-lg border border-white/20 bg-[#123523] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-[#123523] px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div>
            <label className="mb-1 block text-sm text-white/80">Order</label>
            <input
              type="number"
              min="0"
              value={form.orderPosition}
              onChange={(e) => setField("orderPosition", Number(e.target.value))}
              className="w-full rounded-lg border border-white/20 bg-[#123523] px-3 py-2 text-white"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-white/85">
          <input
            type="checkbox"
            checked={form.status === "active"}
            onChange={(e) =>
              setField("status", e.target.checked ? "active" : "inactive")
            }
            className="h-4 w-4"
          />
          Show this service on frontend
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1f8b4c] px-5 py-2 text-white hover:bg-[#176a39] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
