import { motion } from "framer-motion";
import palmImage from "../../assets/images/wanas_palm_residential_avenue.png";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeLeft,
  fadeRight,
  imageReveal,
  viewportOnce,
} from "../common/motionVariants";

const ResidentialCommunities = () => {
  return (
    <section
      className="bg-app py-24 lg:py-36"
      aria-labelledby="residential-heading"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <motion.div
            className="order-2 overflow-hidden rounded-2xl shadow-card lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeLeft}
          >
            <motion.img
              src={palmImage}
              alt="Palm residential avenue lined with contemporary homes"
              className="aspect-4/3 w-full object-cover lg:min-h-[520px]"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={imageReveal}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeRight}
          >
            <SectionTitle
              eyebrow="Residential Communities"
              title="Homes That Belong to Place"
              align="left"
              className="mb-8 lg:mb-10"
            />
            <h2 id="residential-heading" className="sr-only">
              Residential Communities
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
              Our residential developments are conceived as complete communities
              — where architecture, landscape, and lifestyle converge. Tree-lined
              avenues, generous public realms, and thoughtfully scaled homes
              create an atmosphere of calm sophistication and lasting belonging.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ResidentialCommunities;
