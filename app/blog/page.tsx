import Link from "next/link";
import Container from "@/components/Container";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  return (
    <section className="w-full bg-[#f6f4ef] pt-8 pb-20 lg:pt-14 lg:pb-28">
      <Container>
      <span className="inline-flex flex-col text-[13px] font-semibold text-[#0d7d86] tracking-[0.08em] uppercase">
  <span>Writing</span>

  <span className="relative h-[2px] w-full overflow-hidden">
    <span className="line absolute top-0 h-full bg-[#0d7d86]" />
  </span>
</span>

        <h1 className="mt-4 font-bricolage text-[32px] sm:text-[36px] lg:text-[58px] font-extrabold text-[#111111] tracking-[-0.03em]">
          Blog<span className="text-[#0d7d86]">.</span>
        </h1>

        <p className="mt-3 max-w-[560px] text-[15px] sm:text-[16px] text-[#4a4a4a] leading-[1.7]">
          Short notes on conversion, performance, Next.js, AI UI, and
          shipping with taste.
        </p>

        <div className="mt-10 lg:mt-14">
          {blogPosts.map((post, i) => (
            <article
              key={post.slug}
              className="border-t border-black/[.08] py-8 first:pt-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] text-[#8a8a8a]">
                  {post.date}
                </span>
                <span className="text-[11px] font-semibold text-[#0d7d86] uppercase tracking-wide bg-[#DBE2DC] px-2 py-1 rounded-[6px]">
                  {post.tag}
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="block mt-3 group">
                <h2
                  className={`font-bricolage text-[22px] sm:text-[26px] lg:text-[32px] font-bold tracking-[-0.01em] transition-colors duration-200 ${
                    i === 0
                      ? "text-[#0d7d86]"
                      : "text-[#111111] group-hover:text-[#0d7d86]"
                  }`}
                >
                  {post.title}
                </h2>
              </Link>

              <p className="mt-2 max-w-[700px] text-[15px] sm:text-[16px] text-[#4a4a4a] leading-[1.7]">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
