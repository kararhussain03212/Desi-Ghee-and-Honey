import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getSliders } from "../api/sliderApi";
import { getTestimonials } from "../api/testimonialApi";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    sliders: 0,
    products: 0,
    testimonials: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [slidersRes, productsRes, testimonialsRes] = await Promise.all([
          getSliders(),
          getProducts(),
          getTestimonials(),
        ]);

        const extractCount = (response) => {
          const payload = response?.data?.data;
          if (Array.isArray(payload)) return payload.length;
          if (Array.isArray(payload?.data)) return payload.data.length;
          if (Number.isFinite(Number(payload?.meta?.total))) return Number(payload.meta.total);
          return 0;
        };

        setStats({
          sliders: extractCount(slidersRes),
          products: extractCount(productsRes),
          testimonials: extractCount(testimonialsRes),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats from backend.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      title: "Sliders",
      value: stats.sliders,
      link: "/sliders",
      cta: "Open Sliders",
    },
    {
      title: "Products",
      value: stats.products,
      link: "/products",
      cta: "Open Products",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      link: "/testimonials",
      cta: "Open Testimonials",
    },
    {
      title: "Admin",
      value: "Profile",
      link: "/profile",
      cta: "Open Admin",
    },
    
  ];

  const quickActions = [
    { label: "Add Product", link: "/products/new", icon: "pi pi-box" },
    { label: "Create Slider", link: "/sliders/new", icon: "pi pi-images" },
    { label: "New Testimonial", link: "/testimonials/new", icon: "pi pi-comments" },

  ];

  return (
    <section className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 sm:p-7">
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(249,207,54,0.32)_0%,rgba(249,207,54,0)_68%)]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(60,114,252,0.2)_0%,rgba(60,114,252,0)_70%)]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--admin-primary)]">Control Center</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Honey Ghee Dashboard</h2>
          <p className="mt-2 max-w-2xl text-[var(--admin-muted)]">Manage products, homepage sections, testimonials, and account settings from one place.</p>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[linear-gradient(145deg,#111318_0%,#171a20_70%,#1c2028_100%)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--admin-border-amber)]"
          >
            <div className="pointer-events-none absolute -top-10 -right-12 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(249,207,54,0.18)_0%,rgba(249,207,54,0)_72%)] opacity-0 transition group-hover:opacity-100" />
            <p className="text-sm text-[var(--admin-primary)]">{card.title}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {loading ? "-" : card.value}
            </p>

            <Link
              to={card.link}
              className="mt-4 inline-flex rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-4 py-2 text-sm font-semibold text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/25"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Content Snapshot</h3>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">Current totals across key content modules.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
              <p className="text-xs uppercase tracking-widest text-[var(--admin-muted)]">Sliders</p>
              <p className="mt-2 text-2xl font-bold text-white">{loading ? "-" : stats.sliders}</p>
            </div>
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
              <p className="text-xs uppercase tracking-widest text-[var(--admin-muted)]">Products</p>
              <p className="mt-2 text-2xl font-bold text-white">{loading ? "-" : stats.products}</p>
            </div>
            <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
              <p className="text-xs uppercase tracking-widest text-[var(--admin-muted)]">Testimonials</p>
              <p className="mt-2 text-2xl font-bold text-white">{loading ? "-" : stats.testimonials}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">Jump to common admin tasks.</p>
          <div className="mt-4 grid grid-cols-1 gap-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 text-sm font-medium text-white hover:border-[var(--admin-border-amber)] hover:text-[var(--admin-primary)]"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={action.icon} aria-hidden="true" />
                  {action.label}
                </span>
                <span className="pi pi-arrow-right text-xs" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
