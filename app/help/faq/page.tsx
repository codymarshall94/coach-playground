import { HelpArticle } from "@/features/help/components/HelpArticle";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is PRGRM?",
    a: (
      <>
        <p>
          PRGRM is a visual workout-program builder and analyzer for coaches
          and self-coached athletes. You design structured training programs,
          receive real-time analytics (volume, intensity, muscle balance, and a
          goal-fit score), and export finished plans as PDFs or share them via a
          public profile.
        </p>
        <p>
          Think of it as a dedicated training IDE — spreadsheet-level control
          with purpose-built tools like drag-and-drop reordering, advanced set
          types, exercise grouping, and an analytics engine that grades your
          program as you build it.
        </p>
      </>
    ),
  },
  {
    q: "Who is PRGRM for?",
    a: (
      <ul>
        <li>
          <strong>Strength &amp; conditioning coaches</strong> — build
          repeatable templates, export clean PDFs for clients, share plans via
          your public profile.
        </li>
        <li>
          <strong>Self-coached lifters</strong> — get instant volume, intensity,
          and balance feedback while you design your own programming.
        </li>
        <li>
          <strong>Beginners</strong> — start from a template and learn what good
          program structure looks like through the analytics and coach
          suggestions.
        </li>
        <li>
          <strong>Athletes</strong> — manage multi-phase periodization with
          blocks mode and track how training stress is distributed across the
          week.
        </li>
      </ul>
    ),
  },
  {
    q: "Is PRGRM free?",
    a: (
      <p>
        Yes. You can create, edit, preview, and export programs for free —
        no trial, no paywall. Sign-up is only required to save programs to your
        account and share them via a public profile.
      </p>
    ),
  },
  {
    q: "Why use PRGRM instead of a spreadsheet?",
    a: (
      <>
        <p>Spreadsheets are flexible, but they&apos;re not built for training. PRGRM gives you:</p>
        <ul>
          <li>
            <strong>Real-time analytics</strong> — volume, intensity
            distribution, muscle heatmap, and a goal-fit score update live as
            you add exercises.
          </li>
          <li>
            <strong>Drag-and-drop</strong> — reorder days, exercises, and groups
            without copy-pasting rows.
          </li>
          <li>
            <strong>Advanced set types</strong> — drop sets, clusters, myo-reps,
            rest-pause, and AMRAP are first-class citizens, not formula hacks.
          </li>
          <li>
            <strong>One-click PDF export</strong> — no formatting, no print
            settings; just a clean document ready for your client.
          </li>
          <li>
            <strong>Coach suggestions</strong> — the engine ranks concrete
            improvements by how many score points they&apos;re worth.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "Can I use PRGRM as a coach?",
    a: (
      <>
        <p>Absolutely. Coaches use PRGRM to:</p>
        <ul>
          <li>Build repeatable program templates</li>
          <li>Export polished PDFs for clients</li>
          <li>Share plans via a public profile link</li>
          <li>
            Use the analytics engine to validate programming choices before
            handing off
          </li>
        </ul>
        <p>
          We&apos;re actively building more coach-specific tools — stay tuned.
        </p>
      </>
    ),
  },
  {
    q: "Do I need an account to start building?",
    a: (
      <p>
        No. You can open the builder and start creating a program immediately.
        An account is only needed when you want to save, duplicate, or share
        your work.
      </p>
    ),
  },
  {
    q: "What program goals are available?",
    a: (
      <>
        <p>PRGRM supports four goal types. Your choice affects how the analytics engine scores your program:</p>
        <ul>
          <li><strong>Strength</strong> — prioritizes heavy loads, lower rep ranges, and adequate rest</li>
          <li><strong>Hypertrophy</strong> — prioritizes moderate loads, higher volume, and metabolic stress</li>
          <li><strong>Endurance</strong> — prioritizes lighter loads, higher reps, and shorter rest</li>
          <li><strong>Power</strong> — prioritizes explosive movements, moderate loads, and full recovery</li>
        </ul>
      </>
    ),
  },
  {
    q: "Can I switch between days mode and blocks mode?",
    a: (
      <p>
        You can switch from days to blocks via Program Settings — this wraps
        your existing days into a single block. Note that switching to blocks is
        a one-way operation; you can&apos;t go back to flat days mode
        afterward. See{" "}
        <a href="/help/using-blocks">Using Blocks</a> for details.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <HelpArticle title="Frequently Asked Questions">
      <p className="text-muted-foreground">
        Quick answers to the most common questions about PRGRM.
      </p>

      <div className="mt-8 space-y-8 not-prose">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-lg border border-border bg-card/50 open:bg-card"
          >
            <summary className="cursor-pointer select-none px-4 py-3 font-medium text-base hover:text-primary transition-colors list-none flex items-center justify-between">
              {faq.q}
              <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none">
                +
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </HelpArticle>
  );
}
