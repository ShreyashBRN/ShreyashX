import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { blogPosts, getPostBySlug } from "@/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const year = new Date().getFullYear();

  return (
    <section className="w-full bg-[#f6f4ef] pt-8 pb-16 lg:pt-14 lg:pb-24">
      <Container>
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0d7d86] transition-colors duration-200 hover:text-[#0a5f66]"
          >
            <span aria-hidden="true">←</span> Back to Blog
          </Link>

          <div className="mt-6 flex items-center gap-2.5">
            <span className="text-[13px] text-[#8a8a8a]">{post.date}</span>
            <span className="text-[11px] font-semibold text-[#0d7d86] uppercase tracking-wide bg-[#DBE2DC] px-2 py-1 rounded-[6px]">
              {post.tag}
            </span>
          </div>

          <h1 className="mt-4 font-bricolage text-[32px] hover:text-[#0d7d86] sm:text-[40px] lg:text-[52px] font-extrabold text-[#111111] leading-[1.1] tracking-[-0.02em]">
            {post.title}
          </h1>

          <div className="mt-8 border-t border-black/[.08]" />

          <div
            className="mt-8
              [&>p]:mt-4 [&>p]:text-[16px] [&>p]:sm:text-[17px] [&>p]:text-[#3a3a3a] [&>p]:leading-[1.8]
              [&>h2]:mt-10 [&>h2]:mb-1 [&>h2]:font-bricolage [&>h2]:text-[22px] [&>h2]:sm:text-[26px] [&>h2]:font-bold [&>h2]:text-[#111111] [&>h2]:tracking-[-0.01em]
              [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc
              [&>ul>li]:text-[16px] [&>ul>li]:sm:text-[17px] [&>ul>li]:text-[#3a3a3a] [&>ul>li]:leading-[1.7]
              [&_strong]:font-semibold [&_strong]:text-[#111111]
              [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-12 border-t border-black/[.08] pt-10">
            <h3 className="font-bricolage text-[22px] sm:text-[26px] font-bold text-[#111111]">
              Got a project we could work together on?
            </h3>
            <p className="mt-3 text-[15px] sm:text-[16px] text-[#4a4a4a] leading-[1.7] max-w-[520px]">
              I build landing pages, SaaS UI, and mobile apps with AI in the
              loop and judgment at the wheel. Fast scaffolding is cheap now.
              Coherent products that convert are not.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex h-[48px] items-center justify-center rounded-full bg-[#111111] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#222222]"
            >
              Get in touch
            </Link>
          </div>

          <div className="mt-10 border-t border-black/[.08] pt-6 flex items-center justify-between">
            <p className="text-[13px] text-[#8a8a8a]">
              © {year} Shreyash Bagade
            </p>
            <Link
              href="/blog"
              className="text-[13px] text-[#8a8a8a] transition-colors duration-200 hover:text-[#111111]"
            >
              All posts
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
