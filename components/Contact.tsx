"use client";
import { useState } from "react";
import Container from "./Container";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire up your submit logic (API route, email service, etc.) here
    console.log(form);
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
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-[#0d7d86]"
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
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-[#0d7d86]"
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
                value={form.message}
                onChange={handleChange}
                required
                className="mt-2 w-full resize-y rounded-[12px] border border-black/[.08] bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors placeholder:text-[#9a9a9a] focus:border-[#0d7d86]"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full h-[52px] rounded-full bg-[#111111] text-[15px] font-semibold text-white transition-colors duration-250 hover:bg-[#222222]"
            >
              Send Message
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}