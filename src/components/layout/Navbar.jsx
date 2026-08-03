import { useEffect, useState } from "react";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/images/WanasLogo.jpeg";
import Button from "../common/Button";
import Container from "../common/Container";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-wanas-dark/75 shadow-dropdown backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between gap-8 py-5 lg:h-24">
        <a
          href="#home"
          className="flex shrink-0 items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
          onClick={closeMobile}
        >
          <img
            src={logo}
            alt="Wanas Group"
            className="h-11 w-11 rounded-full object-cover ring-1 ring-white/25"
          />
          <span className="font-display text-xl font-semibold tracking-wide text-white lg:text-2xl">
            Wanas Group
          </span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium tracking-[0.12em] text-white/75 uppercase transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 bg-wanas-gold-400 transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
            aria-label="Select language"
          >
            <Globe className="size-4" aria-hidden="true" />
            English
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
          <Button to="/login" variant="primary" className="px-7 py-3">
            Login
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-wanas-dark/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-3.5 text-base font-medium tracking-wide text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/80"
                  aria-label="Select language"
                >
                  <Globe className="size-4" aria-hidden="true" />
                  English
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>
                <Button
                  to="/login"
                  variant="primary"
                  className="w-full"
                  onClick={closeMobile}
                >
                  Login
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
