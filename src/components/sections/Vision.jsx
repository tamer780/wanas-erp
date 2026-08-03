import { motion } from "framer-motion";
import Container from "../common/Container";
import { fadeUp, viewportOnce } from "../common/motionVariants";

const Vision = () => {
  return (
    <section
      className="bg-wanas-dark py-32 lg:py-40"
      aria-labelledby="vision-heading"
    >
      <Container className="max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="mb-8 text-[11px] font-semibold tracking-[0.28em] text-wanas-gold-400 uppercase">
            Our Vision
          </p>
          <h2
            id="vision-heading"
            className="font-display text-4xl leading-[1.15] font-medium text-white md:text-6xl lg:text-7xl"
          >
            Building tomorrow&apos;s landmarks with integrity, elegance, and
            enduring purpose.
          </h2>
          <div
            className="mx-auto mt-12 h-px w-16 bg-wanas-gold-500"
            aria-hidden="true"
          />
          <p className="mx-auto mt-12 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
            We envision cities enriched by thoughtful development — places where
            architecture inspires, communities thrive, and every investment
            carries lasting meaning.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default Vision;
