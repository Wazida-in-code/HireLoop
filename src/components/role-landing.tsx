import Link from "next/link";

export default function RoleLanding({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="striped-dark flex min-h-[calc(100vh_-_4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1010] p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/60">{description}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[#5b50e6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a3fd6] focus-visible:ring-2 focus-visible:ring-[#5b50e6]/50 focus-visible:outline-none"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
