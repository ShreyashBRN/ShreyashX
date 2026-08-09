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
    slug: "production-ready-checklist-for-your-app",
    title: "How to Make Your Application Production-Ready",
    excerpt:
      "Ten things standing between 'it works on my machine' and an app that survives real traffic, real failures, and real 2am pages.",
    date: "Aug 2026",
    tag: "Engineering",
    contentHtml: `
      <p>Every app eventually asks the same question before launch: what actually needs to be in place before this goes live? Not "does it run," but "will it survive." Here's the checklist that answers that.</p>
      <h2>1. Health checks that mean something</h2>
      <p>Unhealthy and unreachable are not the same failure. A readiness probe should stop traffic when a dependency like your DB or cache goes down, while a liveness probe restarts a service that's just stuck. Keep the two separate — conflating them means you either restart a perfectly fine service or keep sending traffic to a broken one.</p>
      <h2>2. Observability beyond logs</h2>
      <p>Structured JSON logs, a correlation ID on every request, dashboards, and distributed tracing turn "something's wrong" into "here's exactly what's wrong and where." Tag every request at the gateway with a trace ID and carry it through every service downstream — it's the difference between debugging in minutes versus hours.</p>
      <h2>3. Config and secrets, externalized</h2>
      <p>Your build artifact — JAR, Docker image, whatever — should be identical across dev, QA, and prod. Only config changes between environments, never code. Pull config from environment variables or a config server, and keep secrets out of git entirely; a vault or cloud secrets manager exists for exactly this.</p>
      <h2>4. Migrations as code</h2>
      <p>Hand-running SQL against prod is how outages start. Versioned, automated migration tools give you a forward-only, traceable history of every schema change, checked into git like everything else.</p>
      <h2>5. CI/CD as a safety net</h2>
      <p>Tests, static analysis, dependency and container scans, coverage thresholds — these aren't bureaucracy, they're what stops "works in dev" from becoming "broke in prod." Build the artifact once and promote the same build through every environment.</p>
      <h2>6. Design for failure</h2>
      <p>Retries with backoff, timeouts, circuit breakers, bulkheads — assume every downstream call will eventually fail and decide in advance what happens next, instead of finding out live.</p>
      <h2>7. SLOs, not vibes</h2>
      <p>Performance isn't "make it fast," it's "meet the number you promised." Define SLOs, track the SLIs that measure them, and set an error budget that pauses deploys when you blow past it. Without that, you're guessing.</p>
      <h2>8. Security from day one</h2>
      <p>TLS everywhere, OAuth2/OIDC, security headers, dependency scanning, and secrets that never touch source control. Bolted-on security is usually missing security.</p>
      <h2>9. Zero-downtime rollouts</h2>
      <p>Blue/green gives you an instant switch and an instant rollback. Canary releases limit the blast radius by ramping traffic gradually. Feature flags decouple deploying code from releasing it, so shipping becomes a technical event and releasing becomes a business decision.</p>
      <h2>10. Runbooks</h2>
      <p>When something breaks at 2am, the on-call engineer shouldn't be reverse-engineering your system from scratch. A good runbook — symptoms, diagnosis, fix, rollback, escalation — is what turns an incident into a non-event.</p>
      <p>Nobody owns all ten of these alone. Production readiness is a team sport — dev, DevOps, SRE, security, all pulling toward the same reliability bar. Pick one section and start there.</p>
    `,
  },
  {
    slug: "marketing-strategies-for-dev-content",
    title: "7 Marketing Strategies for Your Software Development Content",
    excerpt:
      "Publishing is half the job. Here's how to make a blog post, video, or talk actually reach the developers it's for.",
    date: "Aug 2026",
    tag: "Marketing",
    contentHtml: `
      <p>Creating content for developers takes real time. Publishing it is only half the work — if nobody sees it, the effort was wasted. Here's a workflow for getting more out of every piece you make.</p>
      <h2>1. Promote before you publish</h2>
      <p>If you have any kind of following — a small social account, an active community, a Discord — start talking about the work before it's finished. Share a work-in-progress screenshot, run a poll on which approach to take, or ask what problem people actually want solved. It builds interest early and gets you feedback before you've locked anything in. Just make sure you follow through — teasing something and never shipping it burns trust fast.</p>
      <h2>2. Rewrite the content</h2>
      <p>A long post can often become a short how-to, a quick-reference stub, or a condensed guide with minimal extra effort. Most of the original material can stay as-is — you're just reformatting for a different reading context.</p>
      <h2>3. Publish to third-party platforms</h2>
      <p>Cross-posting to established publishing platforms puts your work in front of readers who'll never find your own site. Just use canonical links back to the original so search engines know where the content lives first.</p>
      <h2>4. Repurpose into other formats</h2>
      <p>A blog post can become a video script, a conference talk, a podcast segment, a thread, or a newsletter feature. If a piece performed well in one format, it's usually worth testing in another — the ideas already proved themselves once.</p>
      <h2>5. Follow up on what resonates</h2>
      <p>Writing tends to surface adjacent ideas — a topic you skimmed past deserves its own deep dive, or a strong response to one post signals appetite for a related one. Keep a running list of these threads so you're never starting from zero.</p>
      <h2>6. Syndicate</h2>
      <p>Syndication means letting other publications carry your content to their existing audience. It's a genuine trade: they get content, you get reach. Building an ongoing relationship with a couple of outlets tends to work better than one-off submissions.</p>
      <h2>7. Promote deliberately, more than once</h2>
      <p>A few things make promotion actually work:</p>
      <ul>
        <li>Titles and thumbnails matter — think about why someone would click, without resorting to cheap bait</li>
        <li>One post can be shared more than once; feeds move fast, and a "throwback to this" post still gets clicks months later</li>
        <li>Reaching out to people who'd genuinely find the content useful, especially if you've referenced their work, tends to get real traction</li>
        <li>Timing matters — post when your actual audience is awake, not just when it's convenient for you</li>
        <li>A newsletter, even a small one, tends to have a higher engagement rate than social posts, since it's a list of people who opted in</li>
      </ul>
      <p>None of this replaces good content. But good content that nobody sees might as well not exist — treat distribution as part of the work, not an afterthought.</p>
    `,
  },
  {
    slug: "schema-design-best-practices-for-scalable-databases",
    title: "Schema Design Best Practices for Scalable Databases",
    excerpt:
      "Ten decisions that separate a schema that scales gracefully from one that gets rewritten in eighteen months.",
    date: "Aug 2026",
    tag: "Engineering",
    contentHtml: `
      <p>A schema is easy to get working and surprisingly easy to get wrong in ways that only show up once real traffic hits it. Here's what actually matters when designing one that scales.</p>
      <h2>1. Start with access patterns, not entities</h2>
      <p>Before you draw a single table, understand how the data will actually be read and written — read/write ratio, query complexity, growth rate, and how strict your consistency needs are. The schema should follow from how the app uses data, not the other way around.</p>
      <h2>2. Normalize for integrity, denormalize for speed</h2>
      <p>Normalization keeps data consistent and avoids duplication. Denormalization cuts down on expensive joins for read-heavy workloads. Most real systems end up somewhere in between — normalize where correctness matters, denormalize where reads are on the hot path.</p>
      <h2>3. Pick data types deliberately</h2>
      <p>Small choices compound at scale: prefer INT over BIGINT unless you genuinely expect huge numbers, VARCHAR over TEXT for bounded strings, and TIMESTAMP over DATETIME when time zones matter. Minimizing NULLs also keeps indexing and queries simpler.</p>
      <h2>4. Index with intent</h2>
      <p>Indexes speed up reads but slow down writes and cost storage. Use primary keys to uniquely identify rows, composite indexes for multi-column queries, and partial or covering indexes for specific hot queries. Over-indexing is a real failure mode, not just a theoretical one.</p>
      <h2>5. Partition and shard before you need to</h2>
      <p>Partitioning (range, list, or hash) splits a large table into manageable pieces. Sharding (key-based, range-based, or geographic) spreads data across separate databases entirely. Both are much easier to design in from the start than retrofit under load.</p>
      <h2>6. Use foreign keys where they earn their cost</h2>
      <p>Foreign keys are valuable for referential integrity in transactional systems, but they add overhead that can hurt high-scale analytical workloads. In a microservices setup, it's often better to enforce integrity in application code than to lean on cross-service constraints.</p>
      <h2>7. Rethink auto-incrementing IDs</h2>
      <p>Simple auto-increment IDs create contention once you're distributed. UUIDs, Snowflake-style IDs, or database sequences all avoid that bottleneck while staying globally unique.</p>
      <h2>8. Cache before the database becomes the bottleneck</h2>
      <p>Application-level caching (Redis, Memcached), materialized views for precomputed results, and query caching all take pressure off the database for data that doesn't need to be fetched fresh every time.</p>
      <h2>9. Design for archiving from day one</h2>
      <p>Historical data doesn't need to live in your hot tables forever. Moving old records to archive tables, using time-series storage where appropriate, and automating cleanup keeps the primary schema lean.</p>
      <h2>10. Treat migrations as a first-class process</h2>
      <p>Schema changes are inevitable — plan for them. Use a migration tool to version changes, keep backward compatibility so existing queries don't break mid-rollout, and lean on blue-green deployments or feature flags to ship schema changes safely.</p>
      <p>None of these are exotic. They're the difference between a schema that quietly scales with you and one that needs a rewrite the moment traffic triples.</p>
    `,
  },
  {
    slug: "designing-a-rate-limiter-comprehensive-guide",
    title: "Designing a Rate Limiter: A Comprehensive Guide",
    excerpt:
      "Why every API needs one, the three concepts that define how it behaves, and where it actually sits in your architecture.",
    date: "Aug 2026",
    tag: "Engineering",
    contentHtml: `
      <p>A rate limiter restricts how many requests a client can make in a given window. Without one, a single misbehaving client — malicious or just misconfigured — can take down a service that would otherwise handle load fine.</p>
      <h2>Why it matters</h2>
      <p>A few scenarios make the case on their own. A flash sale sends thousands of simultaneous checkout requests and the backend maxes out CPU and memory. An attacker floods an unprotected API, auto-scaling kicks in, and cloud costs spike before anyone notices. A single user hammers an endpoint until database connections are exhausted and every other user's requests slow down. A bot floods a ticket-booking API and grabs every seat before a real user's page even loads.</p>
      <p>In each case, a rate limiter — capping requests per user, per IP, or per minute — is what keeps one bad actor from degrading the experience for everyone else.</p>
      <h2>Three core concepts</h2>
      <p><strong>Identifier.</strong> Every rate limiter needs a key to track requests against — a user ID for authenticated traffic, an IP address for anonymous visitors, a session ID, or a custom key like an organization ID in a multi-tenant system.</p>
      <p><strong>Time window.</strong> Limits apply over a duration, either a fixed window (100 requests per 60 seconds, resetting on the clock) or a sliding window (counted dynamically over a moving period, which avoids the burst-at-the-boundary problem fixed windows have).</p>
      <p><strong>Limit value.</strong> The threshold itself, which doesn't have to be a single hard number. A soft limit warns before blocking, a hard limit blocks immediately, and burst capacity allows a temporary spike above the normal rate before enforcement kicks in.</p>
      <h2>How limits get enforced</h2>
      <ul>
        <li><strong>Blocking</strong> — requests over the limit are rejected outright, typically with an HTTP 429</li>
        <li><strong>Throttling</strong> — requests aren't rejected, just degraded (lower video quality past a data cap, for example)</li>
        <li><strong>Shaping</strong> — requests are still processed but at lower priority, common in CDNs that favor paying customers under load</li>
      </ul>
      <h2>Client-side backoff matters too</h2>
      <p>Server-side limiting is only half the picture. When a client gets a 429, retrying immediately just makes things worse. Exponential backoff — wait 1 second, then 2, then 4, up to a max — lets the client eventually succeed without adding to the load that triggered the limit in the first place.</p>
      <h2>Where it lives in the architecture</h2>
      <p>A common pattern: the load balancer forwards every request to a dedicated rate limiter service before it reaches any backend. That service checks the request against API-key or user-tier limits, queries a fast distributed store like Redis to track counts, and returns either an OK — forwarded on to the real backend — or a 429 that the load balancer returns directly to the client, never touching the backend at all.</p>
      <p>Keeping the rate limiter as its own service, backed by a shared cache rather than per-instance memory, is what makes the limits hold up consistently across a fleet of backend nodes instead of resetting per instance.</p>
    `,
  },
  {
    slug: "approaching-your-first-event-driven-design",
    title: "Approaching Your First Event-Driven Design Implementation",
    excerpt:
      "A case study in tapping into an existing event bus — breaking a scary distributed-systems problem into three plain components.",
    date: "Aug 2026",
    tag: "Engineering",
    contentHtml: `
      <p>Event-driven design intimidates a lot of developers before they've even started — Kafka, offsets, exactly-once semantics, the whole vocabulary shows up before the actual problem does. Here's how to approach it when you're not building the event bus from scratch, just tapping into one that already exists.</p>
      <h2>The problem</h2>
      <p>Say you're running a marketplace and need to show sellers what percentage of their catalog is out of stock, filterable by country, article type, and so on, close to real-time. A central stock system already publishes an event every time an article's sellable stock changes, and other consumers already subscribe to it. You need to add one more.</p>
      <h2>Reframe it as an aggregation problem</h2>
      <p>Strip away the buzzwords and this is a map-reduce problem: a stream of events comes in, and you need to reduce it into an aggregated view worth showing a user. That reframe points to a clean three-part architecture:</p>
      <ul>
        <li><strong>Consumer</strong> — reads from the event bus, writes to the DB</li>
        <li><strong>API</strong> — read-only serving layer</li>
        <li><strong>DB</strong> — shared between the two</li>
      </ul>
      <p>Each piece is independently deployable and scales on its own.</p>
      <h2>The algorithm, broken into four steps</h2>
      <ol>
        <li><strong>Read events in order.</strong> Subscribing to the bus and preserving FIFO ordering is genuinely one of the harder parts — it depends heavily on how mature the client library is for your language.</li>
        <li><strong>Store to the DB.</strong> Transform and batch the events, validating each one against what's already stored (a snapshot timestamp works well for this) since most queues don't guarantee exactly-once delivery.</li>
        <li><strong>Commit offsets.</strong> For log-based queues, track how far you've read so a restart resumes cleanly instead of reprocessing everything. This step needs to be safe to re-run even after a partial failure.</li>
        <li><strong>Read and serve.</strong> The API computes the aggregate on the fly rather than pre-aggregating, trading some latency at scale for the flexibility to support arbitrary filters without pre-computing every combination.</li>
      </ol>
      <h2>Think in terms of data flow, not just steps</h2>
      <p>Modeling the transformations between each stage — raw event to consumer model, consumer model to stored model, stored model to aggregated result, aggregated result to API response — pays off later. It keeps each stage testable in isolation, and it means inserting a new step (pre-computation, an additional data source) doesn't require touching the rest of the pipeline. Keeping the calculated result separate from the API response shape specifically avoids breaking changes rippling out to consumers of your API.</p>
      <h2>Common traps</h2>
      <ul>
        <li>Don't let connecting to the event bus consume all your design effort — it's one sub-problem, not the whole project</li>
        <li>Don't leave data migration for later; most event buses don't retain full history indefinitely</li>
        <li>Watch your parallelism — two consumer instances processing the same article concurrently is a race condition waiting to happen</li>
        <li>Don't pick your database or language before understanding your bus's guarantees and library maturity</li>
        <li>Keep the API and consumer as separate applications — coupling them caps your consumer scaling at your API's needs and vice versa, and makes failures harder to diagnose</li>
        <li>Design for idempotency — you will reprocess events, plan for it</li>
        <li>Load test throughput before going live, not after</li>
        <li>Don't skip unit tests for the sake of the deadline — with event-driven systems, debugging via manual or functional tests alone is painfully slow</li>
      </ul>
      <p>None of this makes event-driven systems simple — they still demand real observability and a solid grasp of the underlying bus. But breaking the problem into contracts between stages turns a lot of unknowns into knowns, which is most of what makes it approachable.</p>
    `,
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}