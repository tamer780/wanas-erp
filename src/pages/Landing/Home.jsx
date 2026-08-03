import { useEffect } from "react";
import Hero from "../../components/sections/Hero";
import About from "../../components/sections/About";
import Philosophy from "../../components/sections/Philosophy";
import FeaturedProjects from "../../components/sections/FeaturedProjects";
import Vision from "../../components/sections/Vision";
import ResidentialCommunities from "../../components/sections/ResidentialCommunities";
import CommercialProjects from "../../components/sections/CommercialProjects";
import Statistics from "../../components/sections/Statistics";
import WhyChooseUs from "../../components/sections/WhyChooseUs";
import Gallery from "../../components/sections/Gallery";
import CTA from "../../components/sections/CTA";

const Home = () => {
  useEffect(() => {
    document.title = "Wanas Group";
  }, []);

  return (
    <main>
      <Hero />
      <About />
      <Philosophy />
      <FeaturedProjects />
      <Vision />
      <ResidentialCommunities />
      <CommercialProjects />
      <Statistics />
      <WhyChooseUs />
      <Gallery />
      <CTA />
    </main>
  );
};

export default Home;
