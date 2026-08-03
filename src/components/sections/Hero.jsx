import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import residenceImage from "../../assets/images/wanas_main_residence.png";
import Button from "../common/Button";
import Container from "../common/Container";
import { fadeUp, staggerContainer, viewportOnce } from "../common/motionVariants";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-end overflow-hidden pb-28 pt-36 md:items-center md:pb-0 md:pt-24"
      aria-label="Hero"
    >
      <img
        src={residenceImage}
        alt=""
        className="absolute inset-0 size-full object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-wanas-dark/85 via-wanas-dark/45 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-wanas-dark/50 via-transparent to-wanas-dark/20"
        aria-hidden="true"
      />

      <Container className="relative z-10 w-full">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 text-[11px] font-semibold tracking-[0.32em] text-wanas-gold-400 uppercase"
          >
            Wanas Group
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl leading-[1.05] font-medium text-white md:text-7xl lg:text-8xl"
          >
            Building Better Spaces.
            <br />
            Creating Lasting Value.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
          >
            A premium real estate developer shaping distinguished communities
            through modern architecture, enduring craftsmanship, and a legacy of
            trust.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Button href="#projects" variant="primary">
              Explore Projects
            </Button>
            <Button href="#contact" variant="outline">
              Contact Us
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-colors hover:text-white"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase">
          Scroll
        </span>
        <ChevronDown className="size-5" aria-hidden="true" />
      </motion.a>
    </section>
  );
};

export default Hero;
