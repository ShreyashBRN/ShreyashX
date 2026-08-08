import Container from "./Container";

const companies = ["PoolTogether", "NAB India", "Zentrack", "SparkUp"];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#f6f4ef] py-6 lg:py-20">
      <Container>
        <p className="text-center text-[12px] sm:text-[13px] font-semibold text-[#9a9a9a] tracking-[0.12em] uppercase">
          Trusted by teams at
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map((company) => (
            <span
              key={company}
              className="text-[18px] sm:text-[20px] font-bold text-[#4a4a4a] tracking-[-0.01em]"
            >
              {company}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}