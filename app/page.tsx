import Link from "next/link";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import PulseLogo from "@/app/ui/pulse-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt="Dashboard analytics on a laptop"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-blue-900/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Nav bar */}
        <nav className="flex items-center justify-between px-8 py-6 md:px-16">
          <div className="w-32 text-white md:w-40">
            <PulseLogo />
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-white/40 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Hero text */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-4 inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 backdrop-blur-sm">
            Your Business at a Glance
          </span>

          <h1
            className={`${lusitana.className} mb-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl md:leading-tight`}
          >
            Smarter Decisions Start with{" "}
            <span className="text-blue-400">Better Insights</span>
          </h1>

          <p className="mb-10 max-w-xl text-base text-gray-300 md:text-lg">
            Track invoices, manage customers, and watch your revenue grow — all
            from one clean, powerful dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-400 hover:shadow-blue-400/40"
            >
              Get Started Free
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Log in to Dashboard
            </Link>
          </div>
        </div>

        {/* Footer tag line */}
        <p className="pb-6 text-center text-xs text-gray-500">
          Powered by Next.js &amp; Vercel
        </p>
      </div>
    </main>
  );
}
