import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getServices } from "../api/serviceApi";
import { getSliders } from "../api/sliderApi";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    sliders: 0,
    services: 0,
    products: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [slidersRes, servicesRes, productsRes] = await Promise.all([
          getSliders(),
          getServices(),
          getProducts(),
        ]);

        const sliders = Array.isArray(slidersRes?.data?.data) ? slidersRes.data.data : [];
        const services = Array.isArray(servicesRes?.data?.data) ? servicesRes.data.data : [];
        const products = Array.isArray(productsRes?.data?.data) ? productsRes.data.data : [];

        setStats({
          sliders: sliders.length,
          services: services.length,
          products: products.length,
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
      title: "Services",
      value: stats.services,
      link: "/services",
      cta: "Open Services",
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
  ];

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-[#f3a849]/30 bg-gradient-to-r from-[#0d2a1b] to-[#1a5e38] p-5 sm:p-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-white/75">Quick summary of your admin content.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[#f3a849]/25 bg-[#0d2a1b] p-5"
          >
            <p className="text-sm text-[#f3a849]">{card.title}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {loading ? "-" : card.value}
            </p>

            <Link
              to={card.link}
              className="mt-4 inline-flex rounded-lg border border-[#f3a849]/40 px-4 py-2 text-sm font-medium text-white/90 hover:bg-[#1f8b4c]/35"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
