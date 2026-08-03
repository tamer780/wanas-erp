import { Menu, Bell, User } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex size-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-text-primary">
            Wanas Group ERP
          </p>
          <p className="text-xs text-text-muted">Enterprise management</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <div className="inline-flex items-center gap-2 rounded-xl bg-surface-soft px-3 py-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-wanas-100 text-wanas-700">
            <User className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-medium text-text-primary sm:inline">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
