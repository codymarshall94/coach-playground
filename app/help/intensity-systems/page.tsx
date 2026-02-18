import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function IntensitySystemsHelp() {
  return (
    <HelpArticle title="Intensity Systems: RPE, RIR & %1RM">
      <p>
        PRGRM supports three intensity systems so you can prescribe effort the
        way that makes sense for your training style. You can switch systems
        per-exercise.
      </p>

      <h2>RPE (Rate of Perceived Exertion)</h2>
      <p>
        A 1–10 scale describing how hard a set feels. In resistance training
        the most common range is 6–10:
      </p>
      <ul>
        <li><strong>RPE 10</strong> — maximum effort, no reps left in the tank</li>
        <li><strong>RPE 9</strong> — could have done 1 more rep</li>
        <li><strong>RPE 8</strong> — could have done 2 more reps</li>
        <li><strong>RPE 7</strong> — could have done 3 more reps</li>
        <li><strong>RPE 6</strong> — moderate effort, 4+ reps in reserve</li>
      </ul>
      <p>
        RPE is great for auto-regulation — the load adjusts naturally based
        on how you feel each day.
      </p>

      <h2>RIR (Reps in Reserve)</h2>
      <p>
        The inverse of RPE — instead of rating effort, you specify how many
        reps you could still perform after finishing the set:
      </p>
      <ul>
        <li><strong>RIR 0</strong> — failure (equivalent to RPE 10)</li>
        <li><strong>RIR 1</strong> — 1 rep left (equivalent to RPE 9)</li>
        <li><strong>RIR 2</strong> — 2 reps left (equivalent to RPE 8)</li>
        <li><strong>RIR 3</strong> — 3 reps left (equivalent to RPE 7)</li>
      </ul>
      <p>
        Some lifters find RIR more intuitive than RPE. They&apos;re
        functionally equivalent.
      </p>

      <h2>%1RM (Percentage of One-Rep Max)</h2>
      <p>
        Prescribes load as a percentage of your one-rep max for that exercise.
        For example, &quot;80% 1RM&quot; means you load 80% of the heaviest
        weight you can lift for one rep.
      </p>
      <ul>
        <li><strong>90%+</strong> — maximal strength work (1–3 reps)</li>
        <li><strong>75–89%</strong> — strength / strength-hypertrophy (3–6 reps)</li>
        <li><strong>65–74%</strong> — hypertrophy range (6–12 reps)</li>
        <li><strong>50–64%</strong> — muscular endurance / speed work (12+ reps)</li>
      </ul>
      <p>
        %1RM requires knowing your maxes. It&apos;s the most precise system
        but the least flexible day-to-day.
      </p>

      <h2>Switching Systems</h2>
      <p>
        Each exercise in the builder has an intensity system selector. Click
        the current system label (e.g., &quot;RPE&quot;) to switch to RIR or
        %1RM. All sets on that exercise update to the new system.
      </p>

      <h2>Which Should I Use?</h2>
      <ul>
        <li>
          <strong>Beginners</strong> — start with RPE. It teaches you to gauge
          effort without needing to test maxes.
        </li>
        <li>
          <strong>Intermediate lifters</strong> — RPE or RIR both work well.
          Pick whichever feels more natural.
        </li>
        <li>
          <strong>Peaking / competition prep</strong> — %1RM gives precise
          loading for peaking cycles.
        </li>
        <li>
          <strong>Coaching clients</strong> — RPE or RIR are safer since
          clients auto-regulate based on daily readiness.
        </li>
      </ul>
    </HelpArticle>
  );
}
