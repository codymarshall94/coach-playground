import Image from "next/image";

export default function SetTypesHelp() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Advanced Set Types</h1>
      <p>
        PRGRM supports a variety of advanced set types to help you program more
        intelligently for strength, hypertrophy, or fatigue management.
      </p>

      <h2>What Are Set Types?</h2>
      <p>
        When you add an exercise, its sets default to <strong>Standard</strong>.
        You can click into each set to expand its settings and choose a
        different set type from the dropdown menu.
      </p>

      <h2>Available Set Types</h2>
      <ul>
        <li>
          <strong>Standard:</strong> Normal set with fixed reps, RPE/%1RM, and
          rest
        </li>
        <li>
          <strong>Drop Set:</strong> Perform initial reps, then immediately
          reduce weight and continue (1+ drop rounds)
        </li>
        <li>
          <strong>Cluster:</strong> Break a set into mini-reps with intra-rest
        </li>
        <li>
          <strong>Myo-Reps:</strong> Perform activation set + mini sets with
          rest-pauses
        </li>
        <li>
          <strong>Rest-Pause:</strong> Perform reps, rest briefly, repeat
          multiple times
        </li>
        <li>
          <strong>AMRAP:</strong> As Many Reps As Possible (RPE can still apply)
        </li>
        <li>
          <strong>Other:</strong> Custom label for unusual protocols
        </li>
      </ul>

      <h2>Configuring Set Parameters</h2>
      <p>
        When you switch the set type, new input fields will appear depending on
        the type you selected. For example, drop sets will ask for:
      </p>
      <ul>
        <li>
          <strong>Drop %</strong>: How much to reduce the load each drop
        </li>
        <li>
          <strong>Drop Sets</strong>: How many drops you perform
        </li>
      </ul>

      <Image
        src="/images/help/drop-set-editor.png"
        alt="Drop set editor showing reps, RPE, rest, and drop configuration"
        width={700}
        height={400}
        className="rounded border"
      />

      <h2>Tips on When to Use</h2>
      <ul>
        <li>
          Use <strong>Drop Sets</strong> at the end of a session for
          fatigue-driven hypertrophy
        </li>
        <li>
          Use <strong>Cluster Sets</strong> for heavy lifts (e.g. squats,
          deadlifts)
        </li>
        <li>
          Use <strong>Myo-Reps</strong> for isolation exercises with limited
          load
        </li>
      </ul>

      <p>
        Need help applying these? Try adding notes to the set to remind yourself
        (e.g. “use 60% 1RM for each drop”).
      </p>
    </div>
  );
}
