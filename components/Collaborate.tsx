import Link from "next/link";
import Container from "./Container";

export default function Collaborate() {
  return (
    <section className="w-full bg-[#f6f4ef] py- lg:py-1">
      <Container>
        <div className="bg-[#161616] rounded-[28px] p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: label + heading + description */}
          <div>
            <span className="inline-block text-[13px] font-semibold text-[#5fd4c4] tracking-[0.08em] uppercase border-b-2 border-[#5fd4c4] pb-1">
              Collaborate
            </span>

            <h2 className="mt-5 text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-white leading-[1.2] tracking-[-0.02em] max-w-[520px]">
              Need a website, landing page, or mobile app?
            </h2>

            <p className="mt-4 text-[15px] sm:text-[16px] text-[#a3a3a3] leading-[1.7] max-w-[460px]">
              I take on full stack builds for startups and founders who need
              something that looks sharp, ships soon, and is easy to find on
              Google.
            </p>

            {/* Mobile/tablet button — sits under the text, hidden on desktop */}
            <div className="mt-8 lg:hidden">
              <Link
                href="#contact"
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#111111] transition-transform duration-250 hover:-translate-y-[2px]"
              >
                Discuss your project
              </Link>
            </div>
          </div>

          {/* Desktop button — sits to the right, vertically centered */}
          <div className="hidden lg:block shrink-0">
            <Link
              href="#contact"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#111111] transition-transform duration-250 hover:-translate-y-[2px]"
            >
              Discuss your project
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}