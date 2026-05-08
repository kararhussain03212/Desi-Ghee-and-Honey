import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { createProduct, getProduct, updateProduct } from "../../api/productApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const getInitialForm = () => ({
  title: "",
  slug: "",
  description: "",
  sku: "",
  badge: "",
  price: "",
  oldPrice: "",
  rating: "5",
  variants: [{ label: "", price: "" }],
  orderPosition: 0,
  status: "active",
  imageFile: null,
  imagePreview: "",
  imageAlt: "",
});

export default function ProductForm() {
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

    const loadProduct = async () => {
      try {
        const res = await getProduct(id);
        const item = res.data?.data || {};

        setForm({
          title: item.title || "",
          slug: item.slug || "",
          description: item.description || "",
          sku: item.sku || "",
          badge: item.badge || "",
          price: String(item.price ?? ""),
          oldPrice: item.old_price == null ? "" : String(item.old_price),
          rating: String(item.rating ?? "5"),
          variants: (() => {
            const rows = parseVariants(item.variants_json)
              .map((variant) => ({
                label: String(variant?.label || "").trim(),
                price: String(variant?.price ?? ""),
              }))
              .filter((variant) => variant.label || variant.price);
            return rows.length ? rows : [{ label: "", price: "" }];
          })(),
          orderPosition: Number(item.order_position || 0),
          status: item.status === "inactive" ? "inactive" : "active",
          imageFile: null,
          imagePreview: toImageUrl(item.image_path || ""),
          imageAlt: item.image_alt || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!String(form.price).trim()) {
      setError("Price is required.");
      return;
    }

    if (!form.imageFile && !form.imagePreview) {
      setError("Product image is required.");
      return;
    }

    try {
      setSaving(true);

      let imagePath = "";
      if (form.imageFile) {
        const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(apiRoot, "") : "";
        imagePath = await uploadImage(form.imageFile, "products", oldPath);
      } else if (form.imagePreview) {
        imagePath = form.imagePreview.replace(apiRoot, "");
      }

      const normalizedVariants = form.variants
        .map((variant) => ({
          label: String(variant.label || "").trim(),
          price: Number(variant.price || 0),
        }))
        .filter((variant) => variant.label && Number.isFinite(variant.price) && variant.price >= 0);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        sku: form.sku.trim(),
        badge: form.badge.trim(),
        price: Number(form.price || 0),
        old_price: form.oldPrice === "" ? null : Number(form.oldPrice),
        rating: Number(form.rating || 5),
        image_alt: form.imageAlt.trim(),
        variants_json: JSON.stringify(normalizedVariants),
        order_position: Number(form.orderPosition || 0),
        status: form.status === "inactive" ? "inactive" : "active",
      };

      if (imagePath) payload.image_path = imagePath;

      if (isEditMode) await updateProduct(id, payload);
      else await createProduct(payload);

      navigate("/products");
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
    return <div className="text-white/70">Loading product...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Product" : "Add Product"}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-white/80">Name</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="auto-generated-if-empty"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Price</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Old Price</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.oldPrice}
              onChange={(e) => setField("oldPrice", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-white/80">SKU</label>
            <input
              value={form.sku}
              onChange={(e) => setField("sku", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Badge</label>
            <input
              value={form.badge}
              onChange={(e) => setField("badge", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={form.rating}
              onChange={(e) => setField("rating", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
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
          <div>
            <label className="mb-1 block text-sm text-white/80">Variants</label>
            <div className="space-y-2 rounded-lg border border-white/20 bg-[var(--admin-card)] p-3">
              {form.variants.map((variant, index) => (
                <div key={`variant-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_140px_auto]">
                  <input
                    value={variant.label}
                    onChange={(e) =>
                      setField(
                        "variants",
                        form.variants.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)),
                      )
                    }
                    placeholder="1kg"
                    className="w-full rounded-lg border border-white/20 bg-[var(--admin-bg)] px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      setField(
                        "variants",
                        form.variants.map((item, i) => (i === index ? { ...item, price: e.target.value } : item)),
                      )
                    }
                    placeholder="3600"
                    className="w-full rounded-lg border border-white/20 bg-[var(--admin-bg)] px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "variants",
                        form.variants.length > 1
                          ? form.variants.filter((_, i) => i !== index)
                          : [{ label: "", price: "" }],
                      )
                    }
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setField("variants", [...form.variants, { label: "", price: "" }])}
                className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]"
              >
                + Add Variant
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <ImageUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Product Image"
          helperText="Main image shown on frontend product cards"
          required={!isEditMode}
        />

        <div>
          <label className="mb-1 block text-sm text-white/80">Product Image Alt Text</label>
          <input
            value={form.imageAlt}
            onChange={(e) => setField("imageAlt", e.target.value)}
            placeholder="Describe the product image for SEO"
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
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
          Show this product on frontend
        </label>

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
            onClick={() => navigate("/products")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
  const decodeHtmlEntities = (value) =>
    String(value ?? "")
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&#039;", "'");

  const parseVariants = (value) => {
    if (Array.isArray(value)) return value;
    const raw = decodeHtmlEntities(value);
    if (!raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
