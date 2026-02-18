import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function ProgramAnalyticsHelp() {
  return (
    <HelpArticle title="Understanding Program Analytics">
      <p>
        Every program in PRGRM gets a real-time analytics panel that updates as
        you build. It helps you spot imbalances, over-training, and missed
        opportunities — no guesswork required.
      </p>

      <h2>Program Score</h2>
      <p>
        The score dial (0–100) grades your program against your selected goal
        (strength, hypertrophy, endurance, or power). It combines seven
        sub-scores:
      </p>
      <ul>
        <li><strong>Specificity</strong> — are the exercises appropriate for the goal?</li>
        <li><strong>Progression</strong> — is there a logical overload pattern?</li>
        <li><strong>Stress Patterning</strong> — are hard/easy days distributed well?</li>
        <li><strong>Volume Fit</strong> — is total volume in the right range?</li>
        <li><strong>Intensity Fit</strong> — does the intensity mix match the goal?</li>
        <li><strong>Balance &amp; Health</strong> — are push/pull, upper/lower, quad/ham ratios healthy?</li>
        <li><strong>Feasibility</strong> — is the program realistic to recover from?</li>
      </ul>
      <p>
        Each sub-score is weighted differently depending on your program goal.
      </p>

      <h2>Stress Grid</h2>
      <p>
        A week-at-a-glance grid showing the relative training load of each day.
        Color ranges from green (low load) through yellow and orange to red
        (very high load). Rest days appear as empty squares.
      </p>
      <p>
        Look for a healthy mix — not all red, and not all green. Alternating
        harder and lighter days is a good pattern.
      </p>

      <h2>Intensity Mix</h2>
      <p>
        Shows how your weekly sets are distributed across intensity zones:
      </p>
      <ul>
        <li><strong>High</strong> — heavy loads, low reps (RPE 9–10, 85%+ 1RM)</li>
        <li><strong>Moderate</strong> — working loads (RPE 7–8, 65–84% 1RM)</li>
        <li><strong>Low</strong> — lighter / warm-up loads (RPE &lt; 7, &lt; 65% 1RM)</li>
      </ul>
      <p>
        Different goals call for different mixes. A strength program should lean
        heavier; a hypertrophy program wants more moderate-intensity volume.
      </p>

      <h2>Muscle Map</h2>
      <p>
        A body-outline heatmap showing which muscles are targeted across the
        week. Muscles with more sets appear darker. Use this to spot gaps — if
        your rear delts or hamstrings are blank, you may need another exercise.
      </p>

      <h2>Balance Meters</h2>
      <p>Three ratio meters show how balanced your program is:</p>
      <ul>
        <li><strong>Push / Pull</strong> — pressing vs. pulling volume</li>
        <li><strong>Quad / Ham</strong> — quadricep vs. hamstring work</li>
        <li><strong>Upper / Lower</strong> — upper-body vs. lower-body volume</li>
      </ul>
      <p>
        A centered bar means equal balance. A bar tilted to one side means that
        pattern dominates. Some tilt is normal depending on your goal, but
        extreme imbalances increase injury risk.
      </p>

      <h2>Coach Suggestions</h2>
      <p>
        Below the analytics you&apos;ll find ranked improvement cards. Each one
        shows:
      </p>
      <ul>
        <li>Which score dimension it improves</li>
        <li>How many points you&apos;d gain</li>
        <li>Why it matters</li>
        <li>Concrete steps to fix it</li>
      </ul>
      <p>
        Suggestions are sorted by impact — the biggest score gains appear first.
        You don&apos;t have to follow every suggestion; they&apos;re guidance,
        not rules.
      </p>

      <h2>Where to Find Analytics</h2>
      <p>
        Open your program in the builder. The analytics panel is accessible via
        the <strong>Overview</strong> tab on the left sidebar. Per-day analytics
        are shown in the <strong>Insights</strong> panel when editing a specific
        day.
      </p>
    </HelpArticle>
  );
}
