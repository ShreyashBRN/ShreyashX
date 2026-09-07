// app/components/[slug]/page.tsx
//
// Mirrors app/blog/[slug]/page.tsx: static params from the data array,
// notFound() for an unknown slug, then the same section order as your
// screenshots: Preview -> Installation -> Usage -> Props -> Footer.

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Maximize2 } from "lucide-react";
import Container from "@/components/Container";
import ComponentsNavbar from "@/components/ComponentsNavbar";
import Footer from "@/components/Footer";
import { components, getComponentBySlug } from "@/data/components";
import { Tabs, PillTabGroup } from "@/components/ui/Tabs";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PropsTable } from "@/components/ui/PropsTable";
import { InstallCommandBlock } from "@/components/ui/InstallCommandBlock";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getComponentBySlug(slug);
  if (!entry) return {};
  return { title: entry.name, description: entry.fullDescription };
}

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

function installCommandFor(pm: string, entry: ReturnType<typeof getComponentBySlug>) {
  if (!entry) return "";
  const runner: Record<string, string> = {
    npm: "npx",
    pnpm: "pnpm dlx",
    yarn: "yarn dlx",
    bun: "bunx",
  };
  return entry.installCommand.replace(/^npx/, runner[pm]);
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getComponentBySlug(slug);
  if (!entry) notFound();

  return (
    <main className="overflow-x-clip bg-[#f6f4ef] pt-14 transition-colors dark:bg-neutral-950">
      <ComponentsNavbar />
      <Container>
        <div className="mx-auto min-w-0 max-w-3xl py-10 sm:py-14 lg:py-20">
        <Link
          href="/components"
          className="inline-flex items-center gap-2 font-mono text-sm text-neutral-500 hover:text-[#0d7d86] dark:text-neutral-400 dark:hover:text-[#2dd4bf]"
        >
          <ArrowLeft size={16} />
          Back to Components
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
          {entry.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
          {entry.fullDescription}
        </p>

        {/* PREVIEW */}
        <SectionLabel>Preview</SectionLabel>
        <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
          <Tabs
            variant="underline"
            rightSlot={<Maximize2 size={16} className="text-neutral-400 dark:text-neutral-500" />}
            tabs={[
              {
                id: "preview",
                label: "Preview",
                content: (
                  <div className="flex min-h-[280px] min-w-0 max-w-full items-center justify-center overflow-x-auto py-12">
                    {/* Live rendered component goes here, e.g. <FilterSelector /> */}
                    <span className="text-sm text-neutral-400 dark:text-neutral-500">Live preview renders here</span>
                  </div>
                ),
              },
              {
                id: "code",
                label: "Code",
                content: <CodeBlock code={entry.sourceCode} />,
              },
            ]}
          />
        </div>

        {/* INSTALLATION */}
        <SectionLabel>Installation</SectionLabel>
        <PillTabGroup
          tabs={[
            {
              id: "cli",
              label: "CLI",
              content: (
                <div className="min-w-0 max-w-full">
                  <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Install the component using the CLI.</p>
                  <PillTabGroup
                    tabs={PACKAGE_MANAGERS.map((pm) => ({
                      id: pm,
                      label: pm,
                      content: (
                        <InstallCommandBlock command={installCommandFor(pm, entry)} />
                      ),
                    }))}
                  />
                </div>
              ),
            },
            {
              id: "manual",
              label: "Manual",
              content: (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Copy the source from the Code tab above into your components folder.
                </p>
              ),
            },
          ]}
        />

        {/* USAGE */}
        <SectionLabel>Usage</SectionLabel>
        <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Import the component:</p>
        <CodeBlock code={entry.importStatement} className="mb-6" />
        <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Use it in your code:</p>
        <CodeBlock code={entry.usageJsx} />

        {/* PROPS */}
        <SectionLabel>Props</SectionLabel>
        <PropsTable props={entry.props} />
        </div>
      </Container>
      <Footer />
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-12 font-mono text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {children}
    </h2>
  );
}