import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import TrustedBy from "@/components/TrustedBy"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="overflow-x-clip pt-14">
      <Navbar />
      <Hero />
      <Projects />
      <div className="h-8 lg:hidden" />
      <TrustedBy />
      <Contact />
      <Footer />
      
    </main>
  );
}