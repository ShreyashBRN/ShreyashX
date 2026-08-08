import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Collaborate from "@/components/Collaborate";
// import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="overflow-x-clip pt-14">
      <Navbar />
      <Hero />
      <Projects />
      {/* <Collaborate /> */}
      {/* <Contact /> */}


    </main>
  );
}