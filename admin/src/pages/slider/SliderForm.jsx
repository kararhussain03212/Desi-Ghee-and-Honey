import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { createSlider, getSlider, updateSlider } from "../../api/sliderApi";
import { uploadImage } from "../../api/uploadApi";

const getInitialForm = () => ({
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "/product",
  orderPosition: 0,
  status: "active",
  imageFile: null,
  imagePreview: "",
});

export default function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);

  const apiRoot = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

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

    const loadSlider = async () => {
      try {
        const res = await getSlider(id);
        const item = res.data?.data || {};

        setForm({
          title: item.title || "",
          subtitle: item.subtitle || "",
          buttonText: item.button_text || "Shop Now",
          buttonLink: item.button_link || "/product",
          orderPosition: Number(item.order_position || 0),
          status: item.status === "inactive" ? "inactive" : "active",
          imageFile: null,
          imagePreview: toImageUrl(item.image_path || ""),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load slider.");
      } finally {
        setLoading(false);
      }
    };

    loadSlider();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Slider title is required.");
      return;
    }
    if (!isEditMode && !form.imageFile) {
      setError("Slider image is required.");
      return;
    }

    try {
      setSaving(true);

      let imagePath = "";
      if (form.imageFile) {
        imagePath = await uploadImage(form.imageFile, "hero");
      } else if (form.imagePreview) {
        imagePath = form.imagePreview.replace(apiRoot, "");
      }

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        button_text: form.buttonText.trim() || "Shop Now",
        button_link: form.buttonLink.trim() || "/product",
        order_position: Number(form.orderPosition || 0),
        status: form.status === "inactive" ? "inactive" : "active",
      };

      if (imagePath) {
        payload.image_path = imagePath;
      }

      if (isEditMode) await updateSlider(id, payload);
      else await createSlider(payload);

      navigate("/sliders");
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
    return <div className="text-white/70">Loading slider...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Slider" : "Add Slider"}
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
            <label className="mb-1 block text-sm text-white/80">Title</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Button Text</label>
            <input
              value={form.buttonText}
              onChange={(e) => setField("buttonText", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Button Link</label>
          <input
            value={form.buttonLink}
            onChange={(e) => setField("buttonLink", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Subtitle</label>
          <textarea
            rows={4}
            value={form.subtitle}
            onChange={(e) => setField("subtitle", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <label className="flex items-center gap-2 self-end text-sm text-white/85">
            <input
              type="checkbox"
              checked={form.status === "active"}
              onChange={(e) =>
                setField("status", e.target.checked ? "active" : "inactive")
              }
              className="h-4 w-4"
            />
            Show this slider on frontend
          </label>
        </div>

        <ImageUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Slider Image"
          helperText={
            isEditMode
              ? "Upload image to replace current slider image"
              : "Required for new slider"
          }
          required={!isEditMode}
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
            onClick={() => navigate("/sliders")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
