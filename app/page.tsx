import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Collaborate from "@/components/Collaborate"

export default function Home() {
  return (
    <main className="overflow-x-clip pt-14">
      <Navbar />
      <Hero />
      <Projects />
      <Collaborate />

    </main>
  );
}