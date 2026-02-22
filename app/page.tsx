"use client";

import HighlightedText from "@/components/HighlightedText";
import { Logo } from "@/components/Logo";
import { ArrowRight, Download, Search, Users } from "lucide-react";
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
    <main className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo width={90} height={90} />
        <div className="flex items-center gap-2">
          <Link
            href="/marketplace"
            className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            Marketplace
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto flex min-h-[85vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Program design &amp; analysis engine
        </p>
        <h1 className="text-5xl font-extrabold leading-[1.08] tracking-[-0.03em] md:text-7xl">
          Your programs,{" "}
          <HighlightedText color="emerald" skew={1}>
            pressure&#8209;tested
          </HighlightedText>{" "}
          before day&nbsp;one.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Build structured training programs and get live feedback on volume,
          load, muscle balance, and movement gaps &mdash; all before your
          athletes touch a barbell.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/programs/new"
            className="group inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-sm text-muted-foreground">
            No account required.
          </span>
        </div>
      </section>

      {/* ENGINE */}
      <section id="engine" className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">
          It thinks while you build.
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
          Every exercise you add, every set you configure &mdash; the engine is
          scoring, mapping, and flagging in real time. Not after. Not on export.{" "}
          <span className="font-medium text-foreground">Right now.</span>
        </p>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          <div className="flex flex-col gap-3 bg-card p-8">
            <span className="inline-block w-fit rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-semibold tracking-wide text-warning">
              NUDGE
            </span>
            <p className="text-[15px] leading-relaxed text-foreground">
              &ldquo;Quads hit 3&times; this week with zero hamstring
              work.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              Muscle balance flags surface the problems you&rsquo;d only catch
              mid-cycle.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-card p-8">
            <span className="inline-block w-fit rounded-full border border-load-high/40 bg-load-high/10 px-3 py-1 text-xs font-semibold tracking-wide text-load-high">
              LOAD SHIFT
            </span>
            <p className="text-[15px] leading-relaxed text-foreground">
              &ldquo;Volume jumped 40% from Block&nbsp;1 to
              Block&nbsp;2.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              Load scores shift from green to amber so you see the spike before
              your athletes feel it.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-card p-8">
            <span className="inline-block w-fit rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand">
              GAP
            </span>
            <p className="text-[15px] leading-relaxed text-foreground">
              &ldquo;No horizontal pull in your upper day.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
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
        <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
          Not vanity metrics. The numbers coaches actually program around.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-border p-6 transition-colors hover:border-brand/40"
            >
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
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
            <span className="mb-3 inline-block text-3xl font-extrabold text-brand/30">
              01
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Structure your program
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Add blocks, days, exercise groups, and sets. Drag to reorder.
              Start from scratch or pick a template.
            </p>
          </div>
          <div>
            <span className="mb-3 inline-block text-3xl font-extrabold text-brand/30">
              02
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Get real-time feedback
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Volume, load scores, muscle balance, and coach nudges update live
              as you make changes. No save-and-refresh.
            </p>
          </div>
          <div>
            <span className="mb-3 inline-block text-3xl font-extrabold text-brand/30">
              03
            </span>
            <h3 className="mb-2 text-lg font-semibold">
              Export &amp; share
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Download a clean PDF, share via your public profile, or save to
              your library to reuse later.
            </p>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-xs font-semibold tracking-wide text-brand uppercase">
            Marketplace
          </span>
          <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">
            Browse programs from other coaches.
          </h2>
          <p className="mb-12 max-w-xl text-lg text-muted-foreground">
            Find proven templates, grab them for free, and make them your own &mdash;
            or publish yours for the community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight">Discover</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Browse programs by goal, duration, and training style.  Find what fits your athletes.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Download className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight">Clone &amp; Customize</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              One click to copy any program into your builder. Tweak it, analyze it, make it yours.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight">Share Yours</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Publish your programs to the marketplace and let other coaches learn from your programming.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/marketplace"
            className="group inline-flex items-center rounded-full border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-muted"
          >
            Browse the Marketplace
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-primary p-10 py-24 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.02em] text-primary-foreground md:text-5xl">
            For coaches who actually program.
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-primary-foreground/60">
            No signup wall. No feature gates. Open a blank program and start
            building &mdash; the engine does the rest.
          </p>
          <Link
            href="/programs/new"
            className="group inline-flex items-center rounded-full bg-brand px-6 py-3 font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-xs text-primary-foreground/40">
            No account required.
          </p>
        </div>
      </section>
    </main>
  );
}
