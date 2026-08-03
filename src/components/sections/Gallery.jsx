import { motion } from "framer-motion";
import entranceImage from "../../assets/images/wanas_group_entrance.png";
import residenceImage from "../../assets/images/wanas_main_residence.png";
import palmImage from "../../assets/images/wanas_palm_residential_avenue.png";
import skylineImage from "../../assets/images/wanas_skyline_towers.png";
import waterfrontImage from "../../assets/images/wanas_waterfront_residences.png";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "../common/motionVariants";

const GALLERY_ITEMS = [
  {
    src: residenceImage,
    alt: "Main residence exterior",
    caption: "Luxury Residence",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: entranceImage,
    alt: "Wanas Group entrance",
    caption: "Grand Entrance",
    className: "",
  },
  {
    src: waterfrontImage,
    alt: "Waterfront residences",
    caption: "Waterfront Living",
    className: "",
  },
  {
    src: skylineImage,
    alt: "Skyline towers",
    caption: "Skyline Towers",
    className: "md:col-span-1",
  },
  {
    src: palmImage,
    alt: "Palm residential avenue",
    caption: "Palm Community",
    className: "md:col-span-2",
  },
];

const Gallery = () => {
  return (
    <section
      id="gallery"
      className="bg-wanas-cream-50 py-24 lg:py-36"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <SectionTitle
          eyebrow="Gallery"
          title="Spaces Worth Remembering"
          subtitle="A visual journey through the architecture, atmosphere, and craftsmanship of Wanas developments."
        />
        <h2 id="gallery-heading" className="sr-only">
          Gallery
        </h2>

        <motion.div
          className="grid auto-rows-[220px] gap-5 sm:auto-rows-[260px] md:grid-cols-3 md:gap-6 lg:auto-rows-[300px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {GALLERY_ITEMS.map((item) => (
            <motion.figure
              key={item.alt}
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-2xl shadow-card ${item.className}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-0 flex items-end bg-linear-to-t from-wanas-dark/85 via-wanas-dark/25 to-transparent p-7 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-display text-xl font-medium text-white md:text-2xl">
                  {item.caption}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Gallery;
