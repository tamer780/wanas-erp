import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../../assets/images/WanasLogo.jpeg";
import Container from "../common/Container";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const PROJECT_LINKS = [
  { label: "Luxury Residence", href: "#projects" },
  { label: "Waterfront Living", href: "#projects" },
  { label: "Skyline Towers", href: "#projects" },
  { label: "Palm Community", href: "#gallery" },
];

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M6.5 9H3.5v12h3V9zM5 3.5A1.75 1.75 0 1 0 5 7a1.75 1.75 0 0 0 0-3.5zM21 13.3c0-2.9-1.6-4.3-3.7-4.3-1.7 0-2.5.9-2.9 1.6V9h-3v12h3v-6.5c0-1.7.8-2.8 2.3-2.8 1.4 0 2.3 1 2.3 2.8V21h3v-7.7z" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.2 3H21l-6.6 7.5L22 21h-6.2l-4.4-5.7L6.2 21H3.4l7-8L2 3h6.3l4 5.2L18.2 3zm-1.1 16.2h1.7L7 4.7H5.2l11.9 14.5z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "X", href: "#", Icon: XIcon },
];

const Footer = () => {
  return (
    <footer className="bg-wanas-dark text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container className="grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-24">
        <div className="flex flex-col gap-6">
          <a
            href="#home"
            className="inline-flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
          >
            <img
              src={logo}
              alt="Wanas Group"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-white/15"
            />
            <span className="font-display text-2xl font-semibold tracking-wide">
              Wanas Group
            </span>
          </a>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            A premium real estate development and management company crafting
            enduring communities of exceptional quality and architectural
            distinction.
          </p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-wanas-gold-400/60 hover:text-wanas-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-[11px] font-semibold tracking-[0.24em] text-wanas-gold-400 uppercase">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-[11px] font-semibold tracking-[0.24em] text-wanas-gold-400 uppercase">
            Projects
          </h3>
          <ul className="flex flex-col gap-3.5">
            {PROJECT_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-[11px] font-semibold tracking-[0.24em] text-wanas-gold-400 uppercase">
            Contact
          </h3>
          <ul className="flex flex-col gap-5 text-sm text-white/55">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-wanas-gold-400"
                aria-hidden="true"
              />
              <span>Business Bay, Dubai, United Arab Emirates</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone
                className="size-4 shrink-0 text-wanas-gold-400"
                aria-hidden="true"
              />
              <a
                href="tel:+97140000000"
                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
              >
                +971 4 000 0000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail
                className="size-4 shrink-0 text-wanas-gold-400"
                aria-hidden="true"
              />
              <a
                href="mailto:info@wanasgroup.com"
                className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
              >
                info@wanasgroup.com
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Wanas Group. All rights reserved.</p>
          <nav className="flex gap-8" aria-label="Legal">
            <a
              href="#privacy"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-gold-400"
            >
              Terms
            </a>
          </nav>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
