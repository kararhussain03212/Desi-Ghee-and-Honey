import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import foodLogo from "../assets/images/web_logo.png";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/sliders", label: "Sliders" },
  { path: "/products", label: "Products" },
  { path: "/testimonials", label: "Testimonials" },
  { path: "/settings/navbar", label: "Navbar" },
  { path: "/settings/home", label: "Home" },
  { path: "/settings/home-about", label: "Home - About", child: true },
  { path: "/settings/home-company", label: "Home - Company & Products", child: true },
  { path: "/settings/home-offer", label: "Home - Offer / Testimonials / Newsletter", child: true },
  { path: "/settings/footer", label: "Footer" },
  { path: "/settings/product", label: "Product Page" },
  { path: "/settings/contact", label: "Contact & WhatsApp" },
];

const pageTitleMap = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/sliders": "Sliders",
  "/sliders/new": "Add Slider",
  "/products": "Products",
  "/products/new": "Add Product",
  "/testimonials": "Testimonials",
  "/testimonials/new": "Add Testimonial",
  "/settings": "Site Settings",
  "/settings/navbar": "Navbar Settings",
  "/settings/home": "Home Settings",
  "/settings/home-about": "Home - About Settings",
  "/settings/home-company": "Home - Company & Products Settings",
  "/settings/home-offer": "Home - Offer / Testimonials / Newsletter Settings",
  "/settings/footer": "Footer Settings",
  "/settings/product": "Product Page Settings",
  "/settings/contact": "Contact & WhatsApp Settings",
  "/profile": "Admin",
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = useMemo(() => {
    if (pageTitleMap[location.pathname]) {
      return pageTitleMap[location.pathname];
    }
    if (location.pathname.startsWith("/sliders/edit")) return "Edit Slider";
    if (location.pathname.startsWith("/products/edit")) return "Edit Product";
    if (location.pathname.startsWith("/testimonials/edit")) return "Edit Testimonial";
    return "Dashboard";
  }, [location.pathname]);

  const isActivePath = (path) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/settings/home")) {
      setHomeDropdownOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  return (
    <div className="admin-theme flex min-h-screen w-full bg-[var(--admin-bg)] text-[var(--admin-ink)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[var(--admin-primary)] text-blacklack/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[100] flex w-[260px] max-w-[85vw] flex-col
          border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)]
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="border-b border-[var(--admin-border)] px-6 py-5 flex items-center justify-center">
          <img src={foodLogo} alt="Swift Sign" className="h-20 w-auto" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mt-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
            Main
          </p>
          {navItems.map((item) => (
            item.path === "/settings/home" ? (
              <div key={item.path} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => setHomeDropdownOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm duration-200 ${
                    isActivePath("/settings/home")
                      ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                      : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`pi ${homeDropdownOpen ? "pi-chevron-up" : "pi-chevron-down"} text-xs`} />
                </button>
                {homeDropdownOpen ? (
                  <div className="mt-1 space-y-0.5">
                    {navItems
                      .filter((entry) => entry.child)
                      .map((entry) => (
                        <Link
                          key={entry.path}
                          to={entry.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`ml-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm duration-200 ${
                            isActivePath(entry.path)
                              ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                              : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                          }`}
                        >
                          {entry.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            ) : item.child ? null : (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`mb-0.5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm duration-200 ${
                  isActivePath(item.path)
                    ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                    : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--admin-border)] p-3">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--admin-sidebar-hover)]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-strong)] text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-[var(--admin-muted)]">
                {user?.role?.replace("_", " ") || "User"}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
              }}
              className="text-sm text-[var(--admin-muted)] hover:text-white"
              aria-label="Logout"
            >
              <span className="pi pi-sign-out" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[260px]">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-3 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span className="pi pi-bars text-base" aria-hidden="true" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white sm:text-lg">
            {pageTitle}
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)] px-3 py-1.5 text-sm font-semibold text-black hover:bg-[var(--admin-amber)] sm:px-3.5"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 text-white sm:p-6">{children}</main>
      </div>
    </div>
  );
}
