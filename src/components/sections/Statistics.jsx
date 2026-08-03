import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "../common/motionVariants";

const STATS = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 120, suffix: "+", label: "Projects" },
  { value: 6500, suffix: "+", label: "Residential Units" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

const AnimatedCounter = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    let frameId;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(value * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Statistics = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      className="bg-surface-soft py-24 lg:py-36"
      aria-labelledby="stats-heading"
    >
      <Container>
        <SectionTitle
          eyebrow="Our Impact"
          title="Numbers That Speak Trust"
          subtitle="A track record built on consistency, craftsmanship, and client confidence."
        />
        <h2 id="stats-heading" className="sr-only">
          Statistics
        </h2>

        <motion.div
          ref={ref}
          className="grid grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <p className="font-display text-6xl font-medium tracking-tight text-wanas-800 lg:text-7xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-text-secondary uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Statistics;
