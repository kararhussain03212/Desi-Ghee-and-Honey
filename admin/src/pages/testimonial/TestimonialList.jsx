import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../../api/testimonialApi";

const FALLBACK_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='30'>Avatar</text></svg>",
)}`;

export default function TestimonialList() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiRoot = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

  const resolveImage = (value) => {
    if (!value) return FALLBACK_AVATAR;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await getTestimonials();
        setTestimonials(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const nextStatus = item.status === "active" ? "inactive" : "active";
      const { data } = await updateTestimonial(item.id, { status: nextStatus });
      setTestimonials((prev) =>
        prev.map((entry) => (entry.id === data?.data?.id ? data.data : entry)),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("Failed to update testimonial status.");
    }
  };

  if (loading) {
    return <p className="text-white/70">Loading testimonials...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Testimonials</h2>
          <p className="text-sm text-white/65">
            Manage testimonial cards shown on homepage.
          </p>
        </div>
        <Link
          to="/testimonials/new"
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Testimonial
        </Link>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No testimonials found. Add your first testimonial.
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={resolveImage(item.avatar_path)}
                        alt={item.name || "Customer"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_AVATAR;
                        }}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {item.name || "Unnamed Customer"}
                        </h3>
                        <p className="text-sm text-white/65">
                          {item.role || "Verified Customer"}
                        </p>
                      </div>
                    </div>

                    <p className="break-words text-sm text-white/75">
                      {item.review || "No review text"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                        Rating: {Number(item.rating || 5)}
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                        Status: {item.status || "-"}
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                        Order: {Number(item.order_position || 0)}
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
                    <Link
                      to={`/testimonials/edit/${item.id}`}
                      className="rounded-lg bg-[#1f8b4c] px-4 py-2 text-sm text-white hover:bg-[var(--admin-primary-strong)]"
                    >
                      Edit
                    </Link>
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
