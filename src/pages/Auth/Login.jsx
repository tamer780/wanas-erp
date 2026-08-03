import { useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import LoginBrandPanel from "./LoginBrandPanel";
import LoginForm from "./LoginForm";

const Login = () => {
  useEffect(() => {
    document.title = "Wanas Group | Sign In";
  }, []);

  return (
    <main className="flex min-h-screen">
      <LoginBrandPanel />

      <section className="relative flex min-h-screen w-full flex-col bg-surface lg:w-1/2">
        <div className="flex justify-end px-6 pt-6 sm:px-10">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
            aria-label="Select language"
          >
            <Globe className="size-4" aria-hidden="true" />
            English
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <LoginForm />
        </div>

        <footer className="flex flex-col gap-3 px-6 pb-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>&copy; 2026 Wanas Group. All rights reserved.</p>
          <nav className="flex gap-5" aria-label="Legal">
            <a
              href="#privacy"
              className="rounded transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="rounded transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
            >
              Terms of Service
            </a>
          </nav>
        </footer>
      </section>
    </main>
  );
};

export default Login;
