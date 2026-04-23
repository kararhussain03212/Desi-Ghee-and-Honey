import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import foodLogo from "../assets/images/web_logo.png";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/sliders", label: "Sliders" },
  { path: "/services", label: "Services" },
  { path: "/products", label: "Products" },
];

const pageTitleMap = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/sliders": "Sliders",
  "/sliders/new": "Add Slider",
  "/services": "Services",
  "/services/new": "Add Service",
  "/products": "Products",
  "/products/new": "Add Product",
  "/profile": "Admin",
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = useMemo(() => {
    if (pageTitleMap[location.pathname]) {
      return pageTitleMap[location.pathname];
    }
    if (location.pathname.startsWith("/sliders/edit")) return "Edit Slider";
    if (location.pathname.startsWith("/services/edit")) return "Edit Service";
    if (location.pathname.startsWith("/products/edit")) return "Edit Product";
    return "Dashboard";
  }, [location.pathname]);

  const isActivePath = (path) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  return (
    <div className="admin-theme flex min-h-screen w-full bg-[#06140d]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[100] flex w-[260px] max-w-[85vw] flex-col border-r border-white/[0.06] bg-[#0d2a1b]
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="border-b border-white/[0.06] px-6 py-7">
          <div className="flex items-center gap-3">
            <img src={foodLogo} alt="MA Foodstuff" className="h-20 w-auto" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mt-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Main
          </p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`mb-0.5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 duration-200 ${
                isActivePath(item.path)
                  ? "border border-[#f3a849]/45 bg-[#1f8b4c]/25 text-white"
                  : "text-white/70 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.04]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1f8b4c] to-[#145b33] text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-white/30">
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
              className="text-sm text-white/30 hover:text-white/70"
              aria-label="Logout"
            >
              <span className="pi pi-sign-out" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-white/[0.06] bg-[#0d2a1b]/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#0d2a1b]/85 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
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
            className="rounded-lg border border-[#f3a849]/40 bg-[#1f8b4c]/25 px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1f8b4c]/40 sm:px-3.5"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 text-white sm:p-6">{children}</main>
      </div>
    </div>
  );
}
