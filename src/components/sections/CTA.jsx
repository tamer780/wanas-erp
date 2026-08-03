import { motion } from "framer-motion";
import entranceImage from "../../assets/images/wanas_group_entrance.png";
import Button from "../common/Button";
import Container from "../common/Container";
import { fadeUp, viewportOnce } from "../common/motionVariants";

const CTA = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-36 lg:py-44"
      aria-labelledby="cta-heading"
    >
      <img
        src={entranceImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-wanas-dark/70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-wanas-dark/80 via-wanas-dark/40 to-wanas-950/30"
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <p className="mb-6 text-[11px] font-semibold tracking-[0.28em] text-wanas-gold-400 uppercase">
            Begin Your Journey
          </p>
          <div
            className="mx-auto mb-8 h-px w-10 bg-wanas-gold-500"
            aria-hidden="true"
          />
          <h2
            id="cta-heading"
            className="font-display text-4xl leading-[1.12] font-medium text-white md:text-5xl lg:text-7xl"
          >
            Let&apos;s Build the Future Together
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Speak with our team to explore residences, communities, and
            investment opportunities crafted for those who expect more.
          </p>
          <div className="mt-12">
            <Button href="mailto:info@wanasgroup.com" variant="gold">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;
