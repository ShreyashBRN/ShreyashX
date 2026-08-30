"use client";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Container from "./Container";
const EMAILJS_SERVICE_ID = "service_xr877hu";
const EMAILJS_TEMPLATE_ID = "template_vjoiodm";
const EMAILJS_PUBLIC_KEY = "qp7ma87qFelAFUUkf";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("loading");

    try {
      // sendForm reads each input's `name` attribute directly, so it must
      // match the variable names used inside your EmailJS template exactly
      // (this reuses the same field names as your previous portfolio's form).
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="w-full bg-[#f6f4ef] py-12 lg:py-12">
      <Container>
        {/* Sticky wrapper: the whole block (heading + form) pins near the top
            of the viewport once it scrolls into that position, and stays
            fixed there. It naturally unpins once the section's own bottom
            edge reaches that point, since that's how CSS `sticky` works. */}
        <div className="sticky top-14 z-10 max-w-[560px] mx-auto">
          <div className="text-start">
            <span className="relative inline-block text-[13px] font-semibold text-[#0d7d86] tracking-[0.08em] uppercase pb-1">
              Get in touch
              <span className="absolute left-0 -bottom-[3px] h-[2px] w-full overflow-hidden">
                <span className="line absolute top-0 bottom-0 bg-[#0d7d86]" />
              </span>
            </span>

            <h2 className="mt-4 font-bricolage text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold text-[#111111] leading-[1.1] tracking-[-0.03em]">
              Let&apos;s{" "}
              <span className="relative inline-flex items-center overflow-hidden rounded-[14px] px-3 align-middle">
                <span className="highlight absolute inset-0 rounded-[14px] bg-[#c9ece4]" />
                <span className="relative z-10">collaborate</span>
              </span>
            </h2>

            <p className="mt-4 text-[16px] sm:text-[17px] text-[#4a4a4a] leading-[1.7]">
              Need a website, landing page, or app? Drop a message and
              I&apos;ll get back within 24 hours.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 bg-[#fffcf7] border border-black/[.06] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-[14px] font-semibold text-[#111111]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={status === "loading"}
                className="mt-2 w-full rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-[#0d7d86] disabled:opacity-60"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-[14px] font-semibold text-[#111111]"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={status === "loading"}
                className="mt-2 w-full rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-[#0d7d86] disabled:opacity-60"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="message"
                className="block text-[14px] font-semibold text-[#111111]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell me about the project..."
                required
                disabled={status === "loading"}
                className="mt-2 w-full resize-y rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors placeholder:text-[#9a9a9a] focus:border-[#0d7d86] disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 w-full h-[52px] rounded-full bg-[#111111] text-[15px] font-semibold text-white transition-colors duration-250 hover:bg-[#222222] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="mt-4 text-[14px] text-[#0d7d86] text-center">
                Thanks — your message is in. I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-[14px] text-red-600 text-center">
                Something went wrong. Please try again, or email me directly.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}