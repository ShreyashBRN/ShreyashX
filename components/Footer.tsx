"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#f6f4ef]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="border-t border-black/[.08] pt-6 pb-8 flex items-center justify-between">
          <p className="text-[14px] text-[#6a6a6a]">
            &copy; {year} Shreyash Bagade
          </p>
          <a
            href="#top"
            onClick={handleBackToTop}
            className="text-[14px] text-[#6a6a6a] transition-colors duration-200 hover:text-[#111111]"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}