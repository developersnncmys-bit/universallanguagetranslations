import { Plus_Jakarta_Sans, Audiowide, Big_Shoulders } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageAnimations from "./components/PageAnimations";
import Preloader from "./components/Preloader";
import WhatsAppButton from "./components/WhatsAppButton";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

// LEMON MILK-style geometric display font for the hero headline.
// `adjustFontFallback: false` — Next.js doesn't have Big Shoulders metrics
// in its font-override database, so it prints a "Failed to find font
// override values for font `Big Shoulders`" warning on every dev boot when
// it tries to generate a matched fallback. We're OK with the browser's
// default fallback here, so disable the auto-adjust to silence the warning.
const bigShoulders = Big_Shoulders({
  variable: "--font-hero",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
  adjustFontFallback: false,
});

export const metadata = {
  title: "Universal Language Translations — Premium Translation, Transcription & Localization Services",
  description:
    "Enterprise-grade translation, transcription, subtitles, voiceover, and multilingual data services across 100+ languages. Trusted by global brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${audiowide.variable} ${bigShoulders.variable}`}>
      <body>
        <Preloader />
        <PageAnimations />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
