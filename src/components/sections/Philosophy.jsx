import { motion } from "framer-motion";
import { Compass, Heart, Target } from "lucide-react";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "../common/motionVariants";

const CARDS = [
  {
    title: "Vision",
    Icon: Compass,
    text: "To redefine urban living through timeless design, sustainable communities, and architectural landmarks that endure for generations.",
  },
  {
    title: "Mission",
    Icon: Target,
    text: "To deliver exceptional developments that combine beauty, functionality, and investment strength — always placing people at the center.",
  },
  {
    title: "Values",
    Icon: Heart,
    text: "Integrity, excellence, and innovation guide every decision — from first sketch to final handover and beyond.",
  },
];

const Philosophy = () => {
  return (
    <section
      className="bg-wanas-cream-50 py-24 lg:py-36"
      aria-labelledby="philosophy-heading"
    >
      <Container>
        <SectionTitle
          eyebrow="Our Philosophy"
          title="Guided by Purpose"
          subtitle="The principles that shape every Wanas development — clarity of vision, precision in execution, and devotion to lasting quality."
        />
        <h2 id="philosophy-heading" className="sr-only">
          Our Philosophy
        </h2>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {CARDS.map(({ title, Icon, text }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border-light bg-surface p-10 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
            >
              <div className="mb-8 inline-flex size-12 items-center justify-center rounded-full bg-wanas-50 text-wanas-700">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mb-4 font-display text-2xl font-medium text-text-primary md:text-3xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                {text}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Philosophy;
