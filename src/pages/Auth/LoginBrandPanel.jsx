import { ShieldCheck } from "lucide-react";
import logo from "../../assets/images/WanasLogo.jpeg";
import residenceImage from "../../assets/images/wanas_main_residence.png";

const LoginBrandPanel = () => {
  return (
    <aside
      className="relative hidden min-h-screen w-1/2 shrink-0 flex-col overflow-hidden px-10 py-10 xl:px-14 xl:py-12 lg:flex"
      aria-label="Wanas Group branding"
    >
      <img
        src={residenceImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-wanas-dark via-wanas-dark/75 to-wanas-dark/45"
        aria-hidden="true"
      />

      {/* Decorative curved lines */}
      <svg
        className="pointer-events-none absolute -right-8 -top-8 z-10 h-[420px] w-[420px] opacity-40"
        viewBox="0 0 420 420"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M60 20C180 40 340 80 400 200"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-wanas-400/40"
        />
        <path
          d="M40 60C160 90 300 140 380 280"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-wanas-400/30"
        />
        <path
          d="M20 110C140 150 260 210 350 360"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-wanas-400/20"
        />
      </svg>

      <div className="relative z-10 flex items-center gap-3">
        <img
          src={logo}
          alt=""
          className="size-11 rounded-lg object-cover"
          aria-hidden="true"
        />
        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            Wanas Group
          </p>
          <p className="text-sm text-white/55">
            Real Estate Development &amp; Management
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-12 max-w-lg xl:mt-16">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
          Building Better Spaces,{" "}
          <span className="text-wanas-gold-300">Creating Value</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/65 xl:text-lg">
          Manage your projects, sales, finances and operations from one powerful
          platform.
        </p>
      </div>

      <div className="relative z-10 mt-auto flex items-center gap-3 pt-10">
        <span className="flex size-9 items-center justify-center rounded-full bg-wanas-gold-300/15 text-wanas-gold-300">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm text-white/60">
          Secure access to your business, anytime, anywhere.
        </p>
      </div>
    </aside>
  );
};

export default LoginBrandPanel;
