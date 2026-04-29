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

        const sliders = Array.isArray(slidersRes?.data?.data) ? slidersRes.data.data : [];
        const products = Array.isArray(productsRes?.data?.data) ? productsRes.data.data : [];
        const testimonials = Array.isArray(testimonialsRes?.data?.data) ? testimonialsRes.data.data : [];

        setStats({
          sliders: sliders.length,
          products: products.length,
          testimonials: testimonials.length,
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
      title: "Admin",
      value: "Profile",
      link: "/profile",
      cta: "Open Admin",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      link: "/testimonials",
      cta: "Open Testimonials",
    },
    {
      title: "Settings",
      value: "Site",
      link: "/settings/home",
      cta: "Open Settings",
    },
  ];

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 sm:p-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-[var(--admin-muted)]">Quick summary of your admin content.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-5 transition hover:-translate-y-0.5 hover:bg-[var(--admin-card)]"
          >
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
    </section>
  );
}
