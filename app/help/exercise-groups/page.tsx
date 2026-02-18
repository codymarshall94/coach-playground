import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function ExerciseGroupsHelp() {
  return (
    <HelpArticle title="Exercise Groups: Supersets, Giant Sets & Circuits">
      <p>
        Exercise groups let you pair exercises together so they&apos;re
        performed back-to-back with minimal rest. PRGRM supports four group
        types.
      </p>

      <h2>Group Types</h2>
      <ul>
        <li>
          <strong>Standard</strong> — a single exercise performed on its own
          with normal rest between sets.
        </li>
        <li>
          <strong>Superset</strong> — two exercises alternated set-for-set
          (e.g., bench press + barbell row). Rest is taken after completing both
          exercises.
        </li>
        <li>
          <strong>Giant Set</strong> — three or more exercises performed in
          sequence before resting. Great for hypertrophy and time-efficient
          sessions.
        </li>
        <li>
          <strong>Circuit</strong> — a series of exercises performed one after
          another, typically for higher reps with minimal rest between
          movements. Common in endurance and conditioning work.
        </li>
      </ul>

      <h2>Creating a Group</h2>
      <ol>
        <li>Add your first exercise to a day — it starts as a Standard group.</li>
        <li>
          To add a second exercise to the same group, use the{" "}
          <strong>Add to Group</strong> button on the exercise card, or drag an
          exercise into an existing group.
        </li>
        <li>
          The group type updates automatically based on the count (2 = superset,
          3+ = giant set), or you can set it manually.
        </li>
      </ol>

      <h2>Moving Exercises Between Groups</h2>
      <p>
        Drag an exercise from one group to another. If you remove all exercises
        from a group, the group is automatically deleted.
      </p>

      <h2>When to Use Groups</h2>
      <ul>
        <li>
          <strong>Supersets</strong> — pair opposing muscle groups (push/pull)
          to save time without sacrificing performance.
        </li>
        <li>
          <strong>Giant sets</strong> — stack isolation movements for a target
          muscle group to drive metabolic stress.
        </li>
        <li>
          <strong>Circuits</strong> — build conditioning or active-recovery
          sessions with continuous movement.
        </li>
      </ul>

      <p>
        For information on set-level options (drop sets, clusters, etc.), see{" "}
        <a href="/help/set-types">Advanced Set Types</a>.
      </p>
    </HelpArticle>
  );
}
