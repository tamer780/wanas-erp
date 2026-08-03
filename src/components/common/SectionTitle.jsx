import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motionVariants";

const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className = "",
}) => {
  const alignClass =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <motion.div
      className={`mb-16 flex flex-col gap-5 lg:mb-20 ${alignClass} ${className}`.trim()}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      {eyebrow && (
        <div
          className={`flex flex-col gap-4 ${
            align === "left" ? "items-start" : "items-center"
          }`}
        >
          <span
            className={`text-[11px] font-semibold tracking-[0.28em] uppercase ${
              light ? "text-wanas-gold-400" : "text-wanas-600"
            }`}
          >
            {eyebrow}
          </span>
          <span
            className={`h-px w-10 ${
              light ? "bg-wanas-gold-500" : "bg-wanas-gold-500"
            }`}
            aria-hidden="true"
          />
        </div>
      )}
      <h2
        className={`font-display text-4xl leading-[1.15] font-medium tracking-tight md:text-5xl lg:text-6xl ${
          light ? "text-white" : "text-text-primary"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl text-base leading-relaxed md:text-lg ${
            light ? "text-white/70" : "text-text-secondary"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
