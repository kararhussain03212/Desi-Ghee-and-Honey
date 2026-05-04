import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import {
  createTestimonial,
  getTestimonial,
  updateTestimonial,
} from "../../api/testimonialApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const getInitialForm = () => ({
  name: "",
  role: "Verified Customer",
  review: "",
  rating: 5,
  orderPosition: 0,
  status: "active",
  imageFile: null,
  imagePreview: "",
});

export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = useCallback(
    (value) => {
      if (!value) return "";
      if (value.startsWith("http")) return value;
      if (value.startsWith("/uploads/")) return apiRoot + value;
      if (value.startsWith("/")) return value;
      return apiRoot + "/uploads/" + value;
    },
    [apiRoot],
  );

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

    const loadTestimonial = async () => {
      try {
        const res = await getTestimonial(id);
        const item = res?.data?.data || {};

        setForm({
          name: item.name || "",
          role: item.role || "Verified Customer",
          review: item.review || "",
          rating: Number(item.rating || 5),
          orderPosition: Number(item.order_position || 0),
          status: item.status === "inactive" ? "inactive" : "active",
          imageFile: null,
          imagePreview: toImageUrl(item.avatar_path || ""),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonial.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!form.review.trim()) {
      setError("Review is required.");
      return;
    }

    try {
      setSaving(true);

      let imagePath = "";
      if (form.imageFile) {
        imagePath = await uploadImage(form.imageFile, "testimonials");
      } else if (form.imagePreview) {
        imagePath = form.imagePreview.replace(apiRoot, "");
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim() || "Verified Customer",
        review: form.review.trim(),
        rating: Number(form.rating || 5),
        order_position: Number(form.orderPosition || 0),
        status: form.status === "inactive" ? "inactive" : "active",
      };

      if (imagePath) payload.avatar_path = imagePath;

      if (isEditMode) await updateTestimonial(id, payload);
      else await createTestimonial(payload);

      navigate("/testimonials");
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
    return <div className="text-white/70">Loading testimonial...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Customer Name</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Role</label>
            <input
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Review</label>
          <textarea
            rows={5}
            value={form.review}
            onChange={(e) => setField("review", e.target.value)}
            required
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Rating (0 to 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={form.rating}
              onChange={(e) => setField("rating", Number(e.target.value))}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Order</label>
            <input
              type="number"
              min="0"
              value={form.orderPosition}
              onChange={(e) => setField("orderPosition", Number(e.target.value))}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-white/85">
          <input
            type="checkbox"
            checked={form.status === "active"}
            onChange={(e) => setField("status", e.target.checked ? "active" : "inactive")}
            className="h-4 w-4"
          />
          Show this testimonial on frontend
        </label>

        <ImageUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Avatar"
          helperText="Optional customer photo"
          required={false}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/testimonials")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
