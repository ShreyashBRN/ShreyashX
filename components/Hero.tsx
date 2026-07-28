"use client";
import Image from "next/image";
import Container from "./Container";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useEffect, useState } from "react";

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
  return (
    <section className="relative w-full min-h-[92vh] bg-[#f6f4ef] flex items-center">
      <Container className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
        {/* LEFT: Marketing content */}
        <div className="mt-1 animate-[fadeInUp_700ms_ease-out_forwards] text-center lg:text-left">
        <Link
  href="#projects"
  className="inline-flex items-start gap-1 text-[14px] font-semibold text-[#0d7d86] tracking-[-0.02em]"
>
  <span className="inline-flex flex-col">
    <span>Selected work below</span>

    <span className="relative h-[2px] w-full overflow-hidden">
      <span className="line absolute top-0 h-full bg-[#0d7d86]" />
    </span>
  </span>

  <FaLongArrowAltRight className="mt-[2px]" />
</Link>

          <h1 className="mt-6 text-[48px] md:text-[64px] font-bricolage lg:text-[55px] font-extrabold text-[#111111] leading-[1.3] tracking-[-0.06em]">
          I build  &nbsp;&nbsp;
<span
  className={`text-[#0d7d86] transition-opacity duration-500 ${
    fade ? "opacity-100" : "opacity-0"
  }`}
>
  {words[index]}
</span>
            <br />
            that ship clean
            <br />
            and convert.
          </h1>

          <p className="mt-[5px] mx-auto lg:mx-0 max-w-[600px] text-[20px] md:text-[17px] font-normal text-[#4a4a4a] leading-[1.75]">
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

          <div className="mt-7 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
          <Link
  href="#projects"
  className="group inline-flex h-[50px] items-center justify-center overflow-hidden rounded-full bg-[#111111] px-[22px] text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
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
              className="h-[58px] px-[20px] inline-flex items-center justify-center rounded-full b border border-[#d6d6d6] text-[15px] font-semibold transition-colors duration-250 hover:bg-[#fafafa]"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* RIGHT: Floating profile card */}
        <div className="relative animate-[fadeInRight_800ms_ease-out_forwards] [animation-delay:150ms] flex justify-center lg:justify-end">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 80% 60%, rgba(40,180,170,.08), transparent 45%)",
            }}
          />

          <div className="w-full h-[650px] max-w-sm bg-white rounded-[28px] border border-black/[.06]  -ml-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-4 transition-transform duration-250 ">
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

            <div className="relative w-full h-[380px] rounded-[24px] overflow-hidden mt-[18px]">
              <Image
                src="/profile.jpg"
                alt="Shreyash Bagade, full stack developer"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover"
              />
            </div>

            <h2 className="text-center text-[20px] font-bold text-[#111111] mt-3">
              Shreyash Bagade
            </h2>
            <p className="text-center text-[14px] font-semibold text-[#0d7d86] mt-[7px]">
              Full Stack Engineer
            </p>

            <div className="flex items-center justify-center gap-[18px] mt-3">
              <a
                href="https://instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://github.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 rounded-full border border-[#d8d8d8] flex items-center justify-center transition-colors duration-250 hover:bg-[#111111] hover:text-white"
              >
                <FaLinkedin size={20} />
              </a>
            </div>

            <Link
  href="#contact"
  className="group relative mt-5 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-full bg-[#111111] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px]"
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
</Link>
          </div>
        </div>
        </Container>
    </section>
  );
}