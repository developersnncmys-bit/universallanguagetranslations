import { Plus_Jakarta_Sans, Audiowide } from "next/font/google";
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

export const metadata = {
  title: "Universal Language Translations — Premium Translation, Transcription & Localization Services",
  description:
    "Enterprise-grade translation, transcription, subtitles, voiceover, and multilingual data services across 100+ languages. Trusted by global brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${audiowide.variable}`}>
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
