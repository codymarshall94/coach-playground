import Image from "next/image";

export default function ExerciseLibraryHelp() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Using the Exercise Library</h1>
      <p>
        The exercise library lets you search and browse through all the
        available movements in PRGRM. Each exercise includes useful data like
        fatigue score, recovery time, muscle targets, and more.
      </p>

      <h2>1. Opening the Library</h2>
      <p>
        On any workout day, click <strong>“Add First Exercise”</strong> or the{" "}
        <strong>“Exercise Library”</strong> button in the top-right.
      </p>

      <h2>2. Searching & Browsing</h2>
      <p>
        Use the search bar at the top to find exercises by name. You can also
        scroll through muscle group sections like Brace/Core, Push, Pull, etc.
      </p>
      <Image
        src="/images/help/exercise-library.png"
        alt="Exercise library with search and grouped exercises"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>3. Filtering by Muscle or Trait</h2>
      <p>Use the filters to narrow down results by:</p>
      <ul>
        <li>Muscle group (e.g. Posterior Chain, Delts)</li>
        <li>Exercise traits (e.g. compound, machine)</li>
        <li>Fatigue limits, skill level, and equipment</li>
      </ul>
      <Image
        src="/images/help/exercise-filters.png"
        alt="Filter panel in the exercise library"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>4. Understanding Exercise Cards</h2>
      <p>
        Each exercise card includes quick tags like recovery time, fatigue
        score, ROM, and more. Click the eye icon to view advanced metrics.
      </p>

      <h2>5. Viewing Metrics & Muscle Info</h2>
      <p>When expanded, the exercise modal shows:</p>
      <ul>
        <li>
          <strong>Fatigue Demands:</strong> CNS, metabolic, joint stress
        </li>
        <li>
          <strong>Metrics:</strong> Recovery, energy system, calorie burn
        </li>
        <li>
          <strong>Anatomy & Technique:</strong> (if available)
        </li>
      </ul>
      <Image
        src="/images/help/exercise-detail-metrics.png"
        alt="Exercise modal with fatigue, metrics, and anatomy"
        width={700}
        height={600}
        className="rounded border"
      />

      <h2>6. Adding to a Day</h2>
      <p>
        Click the <strong>Add +</strong> button on any exercise card to insert
        it into the currently active workout day. You can add multiple exercises
        before closing the library.
      </p>

      <p>
        Want to customize sets or advanced types? See{" "}
        <a href="/help/set-types">Advanced Set Types</a> for more.
      </p>
    </div>
  );
}
