export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // display string, e.g. "Jul 2026"
  tag: string;
  contentHtml: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-can-scaffold-your-ui-overnight",
    title: "AI Can Scaffold Your UI Overnight",
    excerpt:
      "Vibe coding is fast. Buyers can still smell generic. How to use AI tools without shipping a beige SaaS clone.",
    date: "Jul 2026",
    tag: "AI",
    contentHtml: `
      <p>We live in a golden age of <strong>vibe coding</strong>. You mutter at Cursor, Claude, or Copilot, and suddenly you have a page with soft shadows, a hero, three feature cards, and a button labeled "Get Started" that feels faintly guilty about existing.</p>
      <p>I use these tools every week. They are delightful. They are also very good at producing websites that could belong to twelve different startups if you blurred the logo.</p>
      <h2>What AI is genuinely great at</h2>
      <ul>
        <li>Boilerplate that does not deserve your pride: form states, layout grids, accessibility stubs</li>
        <li>Exploring variants fast when you already know the conversion goal</li>
        <li>Turning a messy content dump into sections that at least have headings</li>
        <li>Helping you ship a V1 before your runway learns to hate you</li>
      </ul>
      <h2>Where it still needs a human</h2>
      <p>Taste doesn't scaffold. The decision about which three features actually matter, the restraint to cut a fourth card nobody asked for, the specific shade of teal that makes your brand feel like <em>yours</em> instead of a template — that's still your job.</p>
      <p>Ship with AI. Just don't ship the first draft.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
  {
    slug: "core-web-vitals-that-actually-convert",
    title: "Core Web Vitals That Actually Convert",
    excerpt:
      "LCP, INP, and CLS as human questions, not lab trophies. What to fix first on a landing page that spends ad money.",
    date: "l 2026",
    tag: "Performance",
    contentHtml: `
      <p>Core Web Vitals get treated like a scoreboard. Green numbers, dopamine hit, done. But every one of these metrics is standing in for a moment a real person actually felt.</p>
      <h2>LCP is "did anything show up"</h2>
      <p>If your hero image loads after your visitor has already decided you're slow, the number doesn't matter. Compress it, size it correctly, and don't make it wait on a font.</p>
      <h2>INP is "did the button work"</h2>
      <p>A slow click on a pricing page is a lost customer, not a lab trophy. Test the actual interactions people take on the way to paying you.</p>
      <h2>CLS is "did I click the wrong thing"</h2>
      <p>Reserve space for images and ads before they load. Nobody forgives a page that moves under their thumb.</p>
      <p>Fix these in the order your visitor experiences them: does it show up, does it respond, does it stay still.</p>
    `,
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
