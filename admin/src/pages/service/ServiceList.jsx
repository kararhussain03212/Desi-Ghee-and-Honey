import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteService, getServices, updateService } from "../../api/serviceApi";

export default function ServiceList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await getServices();
        setServices(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const nextStatus = item.status === "active" ? "inactive" : "active";
      const { data } = await updateService(item.id, { status: nextStatus });
      setServices((prev) =>
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
      setError("Failed to update service status.");
    }
  };

  if (loading) {
    return <p className="text-white/70">Loading services...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Services</h2>
          <p className="text-sm text-white/65">Manage services shown on website.</p>
        </div>
        <Link
          to="/services/new"
          className="inline-flex w-fit rounded-xl bg-[#1f8b4c] px-5 py-2.5 text-white hover:bg-[#176a39]"
        >
          + Add Service
        </Link>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      {services.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0d2a1b] p-6 text-white/70">
          No services found. Add your first service.
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d2a1b]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="flex h-44 w-full items-center justify-center bg-[#123523] md:h-full">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                    Service
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white">
                        {item.title || "Untitled Service"}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {item.description || "No description"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Icon: {item.icon || "-"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Status: {item.status || "-"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Order: {item.order_position || "-"}
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
                        to={`/services/edit/${item.id}`}
                        className="rounded-lg bg-[#1f8b4c] px-4 py-2 text-sm text-white hover:bg-[#176a39]"
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
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
