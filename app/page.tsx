// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero"
// import Projects from "@/components/Projects"

// export default function Home() {
//   return (
//     <main className="overflow-x-hidden">
//       <Navbar />
//       <Hero />
//       <Projects />

//     </main>
//   );
// }


import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="overflow-x-clip pt-14">
      <Navbar />
      <Hero />
      <Projects />
    </main>
  );
}