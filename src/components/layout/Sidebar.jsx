import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../../assets/images/WanasLogo.jpeg";
import { sidebarNavigation } from "./sidebar.config";

const linkClassName = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600",
    isActive
      ? "bg-wanas-600 text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white",
  ].join(" ");

const Sidebar = ({ open = false, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-wanas-dark/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 min-h-0 flex-col bg-wanas-dark transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-wanas-dark-light px-4">
          <NavLink
            to="/dashboard"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
            onClick={onClose}
          >
            <img
              src={logo}
              alt="Wanas Group"
              className="size-9 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Wanas Group
              </p>
              <p className="truncate text-xs text-white/50">ERP System</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-5">
            {sidebarNavigation.map((group) => (
              <li key={group.id}>
                {group.label ? (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                    {group.label}
                  </p>
                ) : null}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={linkClassName}
                          onClick={onClose}
                          end={item.to === "/dashboard"}
                        >
                          <Icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
