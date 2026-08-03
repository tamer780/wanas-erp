import { motion } from "framer-motion";
import entranceImage from "../../assets/images/wanas_group_entrance.png";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeLeft,
  fadeRight,
  imageReveal,
  viewportOnce,
} from "../common/motionVariants";

const HIGHLIGHTS = [
  {
    title: "Mission",
    text: "To create thoughtfully planned environments that elevate everyday living.",
  },
  {
    title: "Vision",
    text: "To be recognized for architectural excellence and lasting community value.",
  },
  {
    title: "Quality",
    text: "Every detail is refined through rigorous standards and craftsmanship.",
  },
  {
    title: "Innovation",
    text: "Modern design principles guide how we shape tomorrow’s landmarks.",
  },
  {
    title: "Long-term Value",
    text: "Developments conceived to appreciate — for residents, investors, and cities.",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="bg-surface py-24 lg:py-36"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeLeft}
          >
            <SectionTitle
              eyebrow="Who We Are"
              title="A Legacy of Distinguished Development"
              align="left"
              className="mb-8 lg:mb-10"
            />
            <p
              id="about-heading"
              className="mb-10 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
            >
              Wanas Group is a premium real estate developer committed to
              shaping spaces of lasting beauty and purpose. Through modern
              architecture, meticulous planning, and an unwavering focus on
              long-term value, we create destinations that inspire trust and
              elevate lifestyles.
            </p>
            <div className="grid gap-7 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="border-l border-wanas-gold-500 pl-5"
                >
                  <h3 className="mb-2 font-display text-xl font-medium text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-card"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeRight}
          >
            <motion.img
              src={entranceImage}
              alt="Wanas Group entrance — branded corporate gateway"
              className="aspect-4/5 w-full object-cover lg:aspect-auto lg:min-h-[620px]"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={imageReveal}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default About;
