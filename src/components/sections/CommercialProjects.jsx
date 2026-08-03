import { motion } from "framer-motion";
import skylineImage from "../../assets/images/wanas_skyline_towers.png";
import Container from "../common/Container";
import { fadeUp, viewportOnce } from "../common/motionVariants";

const CommercialProjects = () => {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="commercial-heading"
    >
      <div className="relative min-h-[75vh] lg:min-h-[85vh]">
        <img
          src={skylineImage}
          alt="Wanas skyline towers — modern commercial architecture"
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-wanas-dark/80 via-wanas-dark/45 to-transparent"
          aria-hidden="true"
        />

        <Container className="relative z-10 flex min-h-[75vh] items-center py-24 lg:min-h-[85vh] lg:py-36">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <p className="mb-5 text-[11px] font-semibold tracking-[0.28em] text-wanas-gold-400 uppercase">
              Commercial Developments
            </p>
            <div className="mb-8 h-px w-10 bg-wanas-gold-500" aria-hidden="true" />
            <h2
              id="commercial-heading"
              className="font-display text-4xl leading-[1.12] font-medium text-white md:text-5xl lg:text-6xl"
            >
              Towers of Ambition &amp; Precision
            </h2>
            <p className="mt-8 text-base leading-relaxed text-white/70 md:text-lg">
              Our commercial developments redefine the skyline with contemporary
              form, intelligent planning, and spaces designed for the future of
              work and enterprise — engineered for performance, designed for
              presence.
            </p>
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export default CommercialProjects;
