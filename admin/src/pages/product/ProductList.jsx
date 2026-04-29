import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts, updateProduct } from "../../api/productApi";
import { useAuth } from "../../context/useAuth";
import { normalizeUserRole } from "../../modules/users/constants";

const PRODUCT_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'><rect width='900' height='600' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='48'>Product</text></svg>",
)}`;

export default function ProductList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, text: "" });

  const isAdmin = normalizeUserRole(user?.role) === "admin";
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canAdd = isAdmin || permissions.includes("add_data");
  const canEdit = isAdmin || permissions.includes("edit_data");
  const canDelete = isAdmin || permissions.includes("delete_data");
  const canPublish = isAdmin || permissions.includes("publish_data");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const apiRoot = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

  const resolveImage = (value) => {
    if (!value) {
      return PRODUCT_FALLBACK_IMAGE;
    }
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) {
      showNoPerm("delete products");
      return;
    }
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) {
      showNoPerm("publish products");
      return;
    }
    try {
      const nextStatus = item.status === "active" ? "inactive" : "active";
      const { data } = await updateProduct(item.id, { status: nextStatus });
      setProducts((prev) =>
        prev.map((item) =>
          item.id === data?.data?.id ? data.data : item,
        ),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("Failed to update product status.");
    }
  };

  if (loading) {
    return <p className="text-white/70">Loading products...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-sm text-white/65">
            Manage products shown on website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (canAdd ? navigate("/products/new") : showNoPerm("add products"))}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Product
        </button>
      </header>

      {toast.show ? (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No products found. Add your first product.
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <img
                  src={resolveImage(item.image_path)}
                  alt={item.title || "Product"}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                  }}
                  className="h-44 w-full object-cover md:h-full"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white">
                        {item.title || "Untitled Product"}
                      </h3>
                      <p className="mt-1 text-sm text-white/65">
                        {item.sku || "No SKU"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {item.description || "No description"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Tag: {item.tag || "-"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Badge: {item.badge || "-"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Price: PKR{" "}
                          {Number(item.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={
                          item.status === "active"
                            ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            : "rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                        }
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => (canEdit ? navigate(`/products/edit/${item.id}`) : showNoPerm("edit products"))}
                        className={`rounded-lg px-4 py-2 text-sm ${canEdit ? "bg-[#1f8b4c] text-white hover:bg-[var(--admin-primary-strong)]" : "border border-white/20 bg-white/10 text-white/60"}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
