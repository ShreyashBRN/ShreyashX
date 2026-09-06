// components/ui/PropsTable.tsx
//
// On mobile this needs to scroll horizontally — a props table has 4 columns
// of variable-width content and squeezing it to fit 375px would make it
// unreadable. The fix is making that scroll intentional and contained
// (own rounded box, own scrollbar) rather than accidental (page-wide
// overflow), matching what you already had roughly right in image 7 —
// this just makes sure it can't leak outside the box on any device.

import { PropDefinition } from "@/data/components";

export function PropsTable({ props }: { props: PropDefinition[] }) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wide text-neutral-500">
              Property
            </th>
            <th className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wide text-neutral-500">
              Type
            </th>
            <th className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wide text-neutral-500">
              Default
            </th>
            <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-neutral-500">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr key={prop.property} className={i !== props.length - 1 ? "border-b border-neutral-200" : ""}>
              <td className="whitespace-nowrap px-4 py-4 font-mono text-neutral-800">{prop.property}</td>
              <td className="whitespace-nowrap px-4 py-4 font-mono text-sky-500">{prop.type}</td>
              <td className="whitespace-nowrap px-4 py-4 font-mono text-neutral-400">{prop.default ?? "-"}</td>
              <td className="px-4 py-4 text-neutral-600">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
