import { motion } from "framer-motion";
import { Building2, Gem, MapPin, ShieldCheck } from "lucide-react";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "../common/motionVariants";

const REASONS = [
  {
    title: "Prime Locations",
    Icon: MapPin,
    text: "Strategic sites chosen for connectivity, prestige, and long-term appreciation.",
  },
  {
    title: "Luxury Architecture",
    Icon: Gem,
    text: "Architecture and interiors refined for elegance, comfort, and timeless appeal.",
  },
  {
    title: "Quality Construction",
    Icon: Building2,
    text: "Uncompromising materials and craftsmanship across every phase of delivery.",
  },
  {
    title: "Trusted Investment",
    Icon: ShieldCheck,
    text: "Transparent processes and proven returns that inspire lasting confidence.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      className="bg-surface py-24 lg:py-36"
      aria-labelledby="why-heading"
    >
      <Container>
        <SectionTitle
          eyebrow="Why Choose Wanas"
          title="Excellence in Every Dimension"
          subtitle="Four pillars that define how we develop, deliver, and stand behind every project."
        />
        <h2 id="why-heading" className="sr-only">
          Why Choose Wanas
        </h2>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {REASONS.map(({ title, Icon, text }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border-light bg-surface p-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
            >
              <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-wanas-50 text-wanas-700">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-display text-xl font-medium text-text-primary md:text-2xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
