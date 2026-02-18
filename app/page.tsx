"use client";

import HighlightedText from "@/components/HighlightedText";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const metrics = [
  {
    label: "Muscle Heatmaps",
    desc: "Per-day and per-week muscle activation mapped to a body diagram. Spot holes instantly.",
  },
  {
    label: "Load Scoring",
    desc: "Every session gets a composite load score \u2014 volume, intensity, and fatigue weighted and color-coded.",
  },
  {
    label: "Volume Trends",
    desc: "Track total volume across blocks and weeks. See progression, not just numbers.",
  },
  {
    label: "Intensity Distribution",
    desc: "RPE / RIR / %1RM histograms per session so you know if the hard day is actually hard.",
  },
  {
    label: "Recovery Overlap",
    desc: "Same muscle group back-to-back with no rest day? The engine calls it out.",
  },
  {
    label: "Movement Coverage",
    desc: "Vertical push, horizontal pull, hip hinge \u2014 see the gaps in your exercise selection at a glance.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAV */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo width={90} height={90} />
        <Link
          href="/login"
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Sign In
        </Link>
      </nav>

      {/* HERO */}
      <section className="mx-auto flex min-h-[85vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 text-sm font-medium tracking-wide text-neutral-500 uppercase">
          Program design &amp; analysis engine
        </p>
        <h1 className="text-5xl font-extrabold leading-[1.08] tracking-[-0.03em] md:text-7xl">
          Your programs,{" "}
          <HighlightedText color="emerald" skew={1}>
            pressure&#8209;tested
          </HighlightedText>{" "}
          before day&nbsp;one.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 md:text-xl">
          Build structured training programs and get live feedback on volume,
          load, muscle balance, and movement gaps &mdash; all before your
          athletes touch a barbell.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/programs/new"
            className="group inline-flex items-center rounded-full bg-black px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-sm text-neutral-400">
            No account required.
          </span>
        </div>
      </section>

      {/* ENGINE */}
      <section id="engine" className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">
          It thinks while you build.
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-neutral-600">
          Every exercise you add, every set you configure &mdash; the engine is
          scoring, mapping, and flagging in real time. Not after. Not on export.{" "}
          <span className="font-medium text-black">Right now.</span>
        </p>

        <div className="grid gap-px overflow-hidden rounded-2xl border bg-neutral-200 md:grid-cols-3">
          <div className="flex flex-col gap-3 bg-white p-8">
            <span className="inline-block w-fit rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700">
              NUDGE
            </span>
            <p className="text-[15px] leading-relaxed text-neutral-800">
              &ldquo;Quads hit 3&times; this week with zero hamstring
              work.&rdquo;
            </p>
            <p className="text-sm text-neutral-500">
              Muscle balance flags surface the problems you&rsquo;d only catch
              mid-cycle.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-white p-8">
            <span className="inline-block w-fit rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold tracking-wide text-orange-700">
              LOAD SHIFT
            </span>
            <p className="text-[15px] leading-relaxed text-neutral-800">
              &ldquo;Volume jumped 40% from Block&nbsp;1 to
              Block&nbsp;2.&rdquo;
            </p>
            <p className="text-sm text-neutral-500">
              Load scores shift from green to amber so you see the spike before
              your athletes feel it.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-white p-8">
            <span className="inline-block w-fit rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              GAP
            </span>
            <p className="text-[15px] leading-relaxed text-neutral-800">
              &ldquo;No horizontal pull in your upper day.&rdquo;
            </p>
            <p className="text-sm text-neutral-500">
              Movement pattern coverage catches what a template never would.
            </p>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section id="metrics" className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">
          Every set. Scored. Mapped. Flagged.
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-neutral-600">
          Not vanity metrics. The numbers coaches actually program around.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-neutral-400"
            >
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">
          Build &rarr; Analyze &rarr; Export
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="mb-3 inline-block text-3xl font-extrabold text-neutral-300">
              01
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Structure your program
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Add blocks, days, exercise groups, and sets. Drag to reorder.
              Start from scratch or pick a template.
            </p>
          </div>
          <div>
            <span className="mb-3 inline-block text-3xl font-extrabold text-neutral-300">
              02
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Get real-time feedback
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Volume, load scores, muscle balance, and coach nudges update live
              as you make changes. No save-and-refresh.
            </p>
          </div>
          <div>
            <span className="mb-3 inline-block text-3xl font-extrabold text-neutral-300">
              03
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Export &amp; share
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Download a clean PDF, share via your public profile, or save to
              your library to reuse later.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-neutral-950 p-10 py-24 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] text-white md:text-5xl">
            For coaches who actually program.
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-neutral-400">
            No signup wall. No feature gates. Open a blank program and start
            building &mdash; the engine does the rest.
          </p>
          <Link
            href="/programs/new"
            className="group inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-xs text-neutral-500">
            No account required.
          </p>
        </div>
      </section>
    </main>
  );
}
