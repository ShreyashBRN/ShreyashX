import Pagination, { type PaginationVariant } from "@/components/pagination";

const variants: PaginationVariant[] = ["pills", "outline", "compact", "input"];

export default function PaginationPreview() {
  return <Pagination variants={variants} />;
}