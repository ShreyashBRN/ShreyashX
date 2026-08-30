// "use client";
// import Image from "next/image";
// import Container from "./Container";
// import Link from "next/link";
// import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useEffect, useState } from "react";

// export default function Hero() {
//     const words = [
//         "frontends",
//         "mobile apps",
//         "landing pages",
//         "websites",
//       ];
      
//       const [index, setIndex] = useState(0);
//       const [fade, setFade] = useState(true);
      
//       useEffect(() => {
//         const interval = setInterval(() => {
//           setFade(false);
      
//           setTimeout(() => {
//             setIndex((prev) => (prev + 1) % words.length);
//             setFade(true);
//           }, 250);
//         }, 2500);
      
//         return () => clearInterval(interval);
//       }, []);
//   return (
//     <section className="relative w-full min-h-[92svh] overflow-x-hidden bg-[#f6f4ef] py-12 lg:py-0 flex items-center">
//       <Container className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 sm:gap-12 lg:gap-20 items-center">
//         {/* LEFT: Marketing content */}
//         <div className="mt-1 animate-[fadeInUp_700ms_ease-out_forwards] text-center lg:text-left">
//         <div className="-mt-8 lg:mt-0 flex justify-start">
//         <Link
//   href="#projects"
//   className="inline-flex items-start gap-1 text-[13px] sm:text-[15px] lg:text-[14px]  font-semibold text-[#0d7d86] tracking-[-0.02em]"
// >
//   <span className="inline-flex flex-col">
//     <span>Selected work below</span>

//     <span className="relative h-[2px] w-full overflow-hidden">
//       <span className="line absolute top-0 h-full bg-[#0d7d86]" />
//     </span>
//   </span>

//   <FaLongArrowAltRight className="mt-[2px]" />
// </Link>
// </div>

// <h1 className="mt-2 lg:mt-6 text-left lg:text-left font-bricolage font-extrabold text-[#111111] tracking-[-0.06em] leading-[1.1] text-[28px] sm:text-[40px] md:text-[48px] lg:text-[55px]">
//   I build{" "}&nbsp;&nbsp;
//   <span
//     className={`text-[#0d7d86] transition-opacity duration-500 ${
//       fade ? "opacity-100" : "opacity-0"
//     }`}
//   >
//     {words[index]}
//   </span>

//   {/* Mobile */}
//   <span className="lg:hidden">
//     <br />
//     that convert.
//   </span>

//   {/* Desktop */}
//   <span className="hidden lg:inline">
//     <br />
//     that ship clean
//     <br />
//     and convert.
//   </span>
// </h1>

//            <p className="mt-2 lg:mt-[5px] max-w-[600px] mx-0 lg:mx-0 text-left text-[14px] sm:text-[17px] md:text-[18px] lg:text-[17px] font-normal text-[#4a4a4a] leading-[1.5] lg:leading-[1.75]">
//             I&apos;m{" "}
//             <span className="relative inline-block">
//   Shreyash Bagade

//   <span className="absolute left-0 -bottom-[3px] h-[2px] w-full overflow-hidden">
//     <span className="line absolute top-0 bottom-0 bg-[#0d7d86]" />
//   </span>
// </span>
//             , a{" "}
//             <span className="relative inline-flex items-center overflow-hidden rounded-[6px] px-2 py-1 align-middle">
//   <span className="highlight absolute inset-0 rounded-[6px]" />
//   <span className="relative z-10">full stack engineer</span>
// </span>
//              . I build websites, landing pages, and mobile apps
//             for startups and founders who need to look sharp and get found.
//           </p>

//           {/* <div className="mt-7 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"> */}
//           <div className="mt-4 lg:mt-7 flex flex-row justify-start gap-3 lg:gap-4">
//           <Link
//   href="#projects"
//   className="group inline-flex h-[45px] lg:h-[50px] items-center justify-center overflow-hidden rounded-full bg-[#111111] px-[15px] lg:px-[22px] text-[14px] lg:text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
// >
//   <span className="relative h-[18px] overflow-hidden">
//     <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
//       View Projects
//     </span>

//     <span
//       aria-hidden="true"
//       className="absolute left-0 top-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
//     >
//       View Projects
//     </span>
//   </span>
// </Link>
//             <Link
//               href="#contact"
//               className="h-[45px] lg:h-[50px] px-[20px]  hover:border-black inline-flex items-center justify-center rounded-full b border border-[#d6d6d6] text-[14px] lg:text-[15px] font-semibold transition-colors duration-250 hover:bg-[#fafafa]"
//             >
//               Contact
//             </Link>
//           </div>
//         </div>

//         {/* RIGHT: Floating profile card */}
//         <div className="-mt-6 lg:mt-0 relative animate-[fadeInRight_800ms_ease-out_forwards] [animation-delay:150ms] flex justify-center lg:justify-end">
//           <div
//             className="absolute inset-0 -z-10"
//             style={{
//               background:
//                 "radial-gradient(circle at 80% 60%, rgba(40,180,170,.08), transparent 45%)",
//             }}
//           />

//           <div className="w-full max-w-sm bg-white rounded-[22px] border border-black/[.06] shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-4 transition-transform duration-250">
//             <div className="flex items-center justify-between">
//               <span className="text-[14px] font-bold text-[#111111]">
//                 Shreyash Bagade
//               </span>
              
//               <span className="flex items-center gap-2 text-[12px] font-bold text-[#5a5a5a]">
//               <span className="relative flex h-[10px] w-[10px]">
//   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//   <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
// </span>
//                 Open to projects
//               </span>
//             </div>

//             {/* <div className="relative w-full h-[280px] lg:h-[380px] overflow-hidden rounded-[24px] mt-[18px]"> */}
//             <div className="relative mt-2 lg:mt-2 w-full h-[300px] lg:h-[380px] overflow-hidden rounded-[16px]">

//   <Image
//     // src="/image.png"
//     src="/img2portfolio.jpeg"
//     alt="Shreyash Bagade"
//     width={500}
//     height={700}
//     className="w-full h-full object-cover "
//   />
// </div>

//             <h2 className="text-center text-[19px] lg:text-[20px] font-bold text-[#111111] mt-3">
//               Shreyash Bagade
//             </h2>
//             <p className="text-center text-[14px] lg:text-[14px] font-semibold text-[#0d7d86] mt-[7px]">
//               Full Stack Engineer
//             </p>

//             <div className="flex items-center justify-center gap-[18px] mt-1 lg:mt-3">
//               <a
//                 href="https://instagram.com/bhgh"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Instagram"
//                 className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
//               >
//                 <FaInstagram size={20} />
//               </a>
//               <a
//                 href="https://github.com/yourhandle"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="GitHub"
//                 className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
//               >
//                 <FaGithub size={20} />
//               </a>
//               <a
//                 href="https://linkedin.com/in/yourhandle"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="LinkedIn"
//                 className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
//               >
//                 <FaLinkedin size={20} />
//               </a>
//             </div>

//             <Link
//   href="#contact"
//   className="group relative mt-4 lg:mt-5 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-full bg-[#111111] text-[14px] lg:text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
// >
//   <span className="relative h-[20px] overflow-hidden">
//     <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
//       Get in Touch
//     </span>

//     <span
//       aria-hidden="true"
//       className="absolute left-0 top-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
//     >
//       Get in Touch
//     </span>
//   </span>
// </Link>
//           </div>
//         </div>
//         </Container>
//     </section>
//   );
// }




"use client";

import Image from "next/image";
import Container from "./Container";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";

const CALENDLY_URL = "https://calendly.com/shreyashbagade-work/30min"; // 👈 replace with your real Calendly link

export default function Hero() {
  const words = [
    "frontends",
    "mobile apps",
    "landing pages",
    "websites",
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 250);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // --- Calendly popup state ---
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootEl(document.body);
  }, []);

  return (
    <section className="hero-frame relative w-full md:min-h-[92svh] overflow-x-hidden bg-[#f6f4ef] py-12 md:py-0 flex md:items-center">
      <Container className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 sm:gap-12 lg:gap-20 items-center">
        {/* LEFT: Marketing content */}
        <div className="mt-1 animate-[fadeInUp_700ms_ease-out_forwards] text-center md:text-left">
          <div className="-mt-8 md:mt-0 flex justify-start">
            <Link
              href="#projects"
              className="inline-flex items-start gap-1 text-[13px] sm:text-[15px] lg:text-[14px]  font-semibold text-[#0d7d86] tracking-[-0.02em]"
            >
              <span className="inline-flex flex-col">
                <span>Selected work below</span>

                <span className="relative h-[2px] w-full overflow-hidden">
                  <span className="line absolute top-0 h-full bg-[#0d7d86]" />
                </span>
              </span>

              <FaLongArrowAltRight className="mt-[2px]" />
            </Link>
          </div>

          <h1 className="mt-2 lg:mt-6 text-left lg:text-left font-bricolage font-extrabold text-[#111111] tracking-[-0.06em] leading-[1.1] text-[28px] sm:text-[40px] md:text-[48px] lg:text-[55px]">
            I build{" "}&nbsp;&nbsp;
            <span
              className={`text-[#0d7d86] transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {words[index]}
            </span>

            {/* Mobile */}
            <span className="md:hidden">
              <br />
              that convert.
            </span>

            {/* Desktop */}
            <span className="hidden md:inline">
              <br />
              that ship clean
              <br />
              and convert.
            </span>
          </h1>

          <p className="mt-2 lg:mt-[5px] max-w-[600px] mx-0 lg:mx-0 text-left text-[14px] sm:text-[17px] md:text-[18px] lg:text-[17px] font-normal text-[#4a4a4a] leading-[1.5] lg:leading-[1.75]">
            I&apos;m{" "}
            <span className="relative inline-block">
              Shreyash Bagade
              <span className="absolute left-0 -bottom-[3px] h-[2px] w-full overflow-hidden">
                <span className="line absolute top-0 bottom-0 bg-[#0d7d86]" />
              </span>
            </span>
            , a{" "}
            <span className="relative inline-flex items-center overflow-hidden rounded-[6px] px-2 py-1 align-middle">
              <span className="highlight absolute inset-0 rounded-[6px]" />
              <span className="relative z-10">full stack engineer</span>
            </span>
            . I build websites, landing pages, and mobile apps
            for startups and founders who need to look sharp and get found.
          </p>

          <div className="mt-4 lg:mt-7 flex flex-row justify-start gap-3 lg:gap-4">
            <Link
              href="#projects"
              className="group inline-flex h-[45px] lg:h-[50px] items-center justify-center overflow-hidden rounded-full bg-[#111111] px-[15px] lg:px-[22px] text-[14px] lg:text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
            >
              <span className="relative h-[18px] overflow-hidden">
                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  View Projects
                </span>

                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                >
                  View Projects
                </span>
              </span>
            </Link>
            <Link
              href="#contact"
              className="h-[45px] lg:h-[50px] px-[20px]  hover:border-black inline-flex items-center justify-center rounded-full b border border-[#d6d6d6] text-[14px] lg:text-[15px] font-semibold transition-colors duration-250 hover:bg-[#fafafa]"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* RIGHT: Floating profile card */}
        <div className="-mt-6 md:mt-0 relative animate-[fadeInRight_800ms_ease-out_forwards] [animation-delay:150ms] flex justify-center md:justify-end">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 80% 60%, rgba(40,180,170,.08), transparent 45%)",
            }}
          />

          <div className="w-full max-w-sm bg-white rounded-[22px] border border-black/[.06] shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-4 transition-transform duration-250">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#111111]">
                Shreyash Bagade
              </span>

              <span className="flex items-center gap-2 text-[12px] font-bold text-[#5a5a5a]">
                <span className="relative flex h-[10px] w-[10px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
                </span>
                Open to projects
              </span>
            </div>

            <div className="relative mt-2 lg:mt-2 w-full h-[300px] lg:h-[380px] overflow-hidden rounded-[16px]">
              <Image
                src="/img2portfolio.jpeg"
                alt="Shreyash Bagade"
                width={500}
                height={700}
                className="w-full h-full object-cover "
              />
            </div>

            <h2 className="text-center text-[19px] lg:text-[20px] font-bold text-[#111111] mt-3">
              Shreyash Bagade
            </h2>
            <p className="text-center text-[14px] lg:text-[14px] font-semibold text-[#0d7d86] mt-[7px]">
              Full Stack Engineer
            </p>

            <div className="flex items-center justify-center gap-[18px] mt-1 lg:mt-3">
              <a
                href="https://www.instagram.com/shreyashbrn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://github.com/ShreyashBRN"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/shreyash-b-949033432/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 lg:h-10 lg:w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaLinkedin size={20} />
              </a>
            </div>

            <button
              onClick={() => setIsCalendlyOpen(true)}
              className="group relative mt-4 lg:mt-5 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-full bg-[#111111] text-[14px] lg:text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
            >
              <span className="relative h-[20px] overflow-hidden">
                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  Get in Touch
                </span>

                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                >
                  Get in Touch
                </span>
              </span>
            </button>
          </div>
        </div>
      </Container>

      {rootEl && (
        <PopupModal
          url={CALENDLY_URL}
          rootElement={rootEl}
          open={isCalendlyOpen}
          onModalClose={() => setIsCalendlyOpen(false)}
        />
      )}
    </section>
  );
}