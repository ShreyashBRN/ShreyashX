// app/components/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import ComponentsNavbar from "@/components/ComponentsNavbar";
import ComponentsFooter from "@/components/ComponentsFooter";
import { components, getComponentBySlug } from "@/data/components";
import { PillTabGroup } from "@/components/ui/Tabs";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PropsTable } from "@/components/ui/PropsTable";
import { InstallCommandBlock } from "@/components/ui/InstallCommandBlock";
import { PreviewPanel } from "@/components/ui/PreviewPanel";

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

          <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
            {entry.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
            {entry.fullDescription}
          </p>

          {/* PREVIEW */}
          <SectionLabel>Preview</SectionLabel>
          <PreviewPanel slug={entry.slug} code={entry.previewCode} />

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
                        content: <InstallCommandBlock command={installCommandFor(pm, entry)} />,
                      }))}
                    />
                  </div>
                ),
              },
              {
                id: "manual",
                label: "Manual",
                content: (
                  <div className="min-w-0 max-w-full">
                    <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
                      Copy and paste the code into your project.
                    </p>
                    <CodeBlock code={entry.sourceCode} filename={`${entry.slug}.jsx`} />
                  </div>
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
      <ComponentsFooter />
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