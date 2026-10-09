import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import LanguageStory from "./components/LanguageStory";
import GlobalLanguageNetwork from "./components/GlobalLanguageNetwork/GlobalLanguageNetwork";
import Services from "./components/Services";
import Partnership from "./components/Partnership";
import TranslationSubservices from "./components/TranslationSubservices";
import WhyChooseUs from "./components/WhyChooseUs";
import Process from "./components/Process";
// import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import EnquirySection from "./components/EnquirySection";
import HomeMobileAnimations from "./components/HomeMobileAnimations";

export default function Home() {
  return (
    <>
      <HomeMobileAnimations />
       <div className="hero-scroll-stage">
       <Hero />
      </div>
      {/* <div className="hero-sunrise" aria-hidden="true" /> */}

      {/* <TrustedBy /> */}
      {/* <LanguageStory /> */}
      <Services />
      {/* GlobalLanguageNetwork (world map / "LANGUAGE COVERAGE / ACTIVE
          MARKETS") replaced by the Partnership section below — an
          editorial "how we partner" moment (named account lead, consistent
          team, terminology ownership, SLA) that speaks to the operating
          model rather than scale/geography. Light bg bridges the dark
          Services and dark TranslationSubservices sections. Re-enable
          the map by uncommenting the line below. */}
      {/* <GlobalLanguageNetwork /> */}
      <Partnership />
      <TranslationSubservices />
      <WhyChooseUs />
      <div className="process-sunrise" aria-hidden="true" />
      <Process />
      {/* <Testimonials /> */}
      <FAQ />
      <EnquirySection />
    </>
  );
}
