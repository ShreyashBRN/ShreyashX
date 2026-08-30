"use client";

import { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";
import Container from "./Container";

const CALENDLY_URL = "https://calendly.com/shreyashbagade-work/30min";

export default function Collaborate() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootEl(document.body);
  }, []);

  return (
    <section className="w-full bg-[#f6f4ef]">
      <div className="bg-[#161616] rounded-[16px] lg:rounded-[20px] p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 lg:gap-4">
        {/* Left: label + heading + description */}
        <div>
          <span className="relative inline-block text-[11px] sm:text-[14px] font-semibold text-[#5fd4c4] tracking-[0.08em] uppercase pb-0.5">
            Collaborate
            <span className="absolute left-0 -bottom-[3px] h-[2px] w-full overflow-hidden">
              <span className="line absolute top-0 bottom-0 bg-[#5fd4c4]" />
            </span>
          </span>

          <h2 className="mt-2 lg:mt-4 text-[15px] sm:text-[20px] lg:text-[27px] font-extrabold text-white leading-[1.2] tracking-[-0.02em] max-w-[600px]">
            Need a website, landing page, or mobile app?
          </h2>

          <p className="mt-1.5 lg:mt-3.5 text-[11px] sm:text-[17px] text-[#a3a3a3] leading-[1.4] max-w-[560px]">
            I take on full stack builds for startups and founders who need
            something that looks sharp, ships soon, and is easy to find on
            Google.
          </p>

          {/* Mobile/tablet button — sits under the text, hidden on desktop */}
          <div className="mt-2 lg:mt-3 md:hidden">
            <button
              onClick={() => setIsCalendlyOpen(true)}
              className="inline-flex h-[30px] sm:h-[38px] items-center justify-center rounded-full bg-white px-4 sm:px-5 text-[11px] sm:text-[13px] font-semibold text-[#111111] transition-transform duration-250 hover:-translate-y-[2px]"
            >
              Discuss your project
            </button>
          </div>
        </div>

        {/* Desktop button — sits to the right, vertically centered */}
        <div className="hidden md:block shrink-0">
          <button
            onClick={() => setIsCalendlyOpen(true)}
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#111111] transition-transform duration-250 hover:-translate-y-[2px]"
          >
            Discuss your project
          </button>
        </div>
      </div>
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