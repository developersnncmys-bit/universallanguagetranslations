import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import LanguageStory from "./components/LanguageStory";
import GlobalLanguageNetwork from "./components/GlobalLanguageNetwork/GlobalLanguageNetwork";
import Services from "./components/Services";
import TranslationSubservices from "./components/TranslationSubservices";
import WhyChooseUs from "./components/WhyChooseUs";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import EnquirySection from "./components/EnquirySection";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="hero-sunrise" aria-hidden="true" />
      {/* <TrustedBy /> */}
      {/* <LanguageStory /> */}
      <Services />
      <GlobalLanguageNetwork />
      <TranslationSubservices />
      <WhyChooseUs />
      <div className="process-sunrise" aria-hidden="true" />
      <Process />
      <Testimonials />
      <FAQ />
      <EnquirySection />
    </>
  );
}
