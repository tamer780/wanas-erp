import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import AppFooter from "../components/layout/AppFooter";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 py-6 pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pl-4 lg:pr-8">
          <Outlet />
        </main>

        <AppFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
