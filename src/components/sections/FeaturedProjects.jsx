import { motion } from "framer-motion";
import residenceImage from "../../assets/images/wanas_main_residence.png";
import waterfrontImage from "../../assets/images/wanas_waterfront_residences.png";
import skylineImage from "../../assets/images/wanas_skyline_towers.png";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "../common/motionVariants";

const PROJECTS = [
  {
    title: "Luxury Residence",
    image: residenceImage,
    description:
      "Refined homes designed for elevated living — spacious interiors, premium finishes, and architectural presence.",
  },
  {
    title: "Waterfront Living",
    image: waterfrontImage,
    description:
      "Coastal elegance with panoramic views — residences that celebrate light, water, and open horizon living.",
  },
  {
    title: "Skyline Towers",
    image: skylineImage,
    description:
      "Contemporary towers that redefine the skyline — intelligent planning, striking form, and lasting presence.",
  },
];

const FeaturedProjects = () => {
  return (
    <section
      id="projects"
      className="bg-surface py-24 lg:py-36"
      aria-labelledby="projects-heading"
    >
      <Container>
        <SectionTitle
          eyebrow="Featured Developments"
          title="Signature Destinations"
          subtitle="A curated selection of Wanas projects — each crafted to embody luxury, location, and lasting appeal."
        />
        <h2 id="projects-heading" className="sr-only">
          Featured Developments
        </h2>

        <motion.div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {PROJECTS.map((project) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              whileHover={{ y: -12 }}
              transition={{ duration: 0.4 }}
              className="group overflow-hidden rounded-2xl bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 lg:p-9">
                <h3 className="mb-3 font-display text-2xl font-medium text-text-primary md:text-3xl">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                  {project.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default FeaturedProjects;
