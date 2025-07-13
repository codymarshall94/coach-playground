import Image from "next/image";

export default function UsingBlocksHelp() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Using Blocks to Organize Your Program</h1>
      <p>
        Blocks mode helps you create structured, multi-week training phases by
        organizing your workouts into grouped blocks. This is ideal for advanced
        periodization, linear progression, or deloading strategies.
      </p>

      <h2>What Are Blocks?</h2>
      <p>
        A <strong>block</strong> is a collection of workout days (e.g., Push /
        Pull / Legs / Rest) that repeat over a defined period (e.g., 4 weeks).
        PRGRM shows the block name, number of weeks, and days inside each block.
      </p>
      <Image
        src="/images/help/blocks-ui.png"
        alt="Block UI showing Block 1 with Push, Pull, Legs, Rest days"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Switching to Blocks Mode</h2>
      <p>
        By default, PRGRM starts in simple <strong>Days mode</strong>, where
        your training week is a flat list of days. To switch to Blocks:
      </p>
      <ul>
        <li>
          Click the <strong>Program Settings</strong> icon (top-right of the
          program title)
        </li>
        <li>
          Toggle <strong>“Switch to Blocks”</strong>
        </li>
        <li>
          Confirm the switch — this wraps your existing days into one block
        </li>
      </ul>
      <Image
        src="/images/help/program-settings.png"
        alt="Program settings modal showing the 'Switch to Blocks' toggle"
        width={400}
        height={200}
        className="rounded border"
      />

      <p className="text-sm text-muted-foreground italic">
        ⚠️ Note: This action is not reversible. Once you switch to Blocks, your
        days are grouped into a block permanently.
      </p>

      <h2>Managing Blocks</h2>
      <p>Once in Blocks mode, you can:</p>
      <ul>
        <li>Rename each block (e.g., “Week 1–4 Hypertrophy”, “Deload Week”)</li>
        <li>Adjust the week duration (e.g., 4 weeks, 3 weeks)</li>
        <li>
          Add additional blocks using <strong>“+ Add Block”</strong>
        </li>
      </ul>

      <h2>When to Use Blocks</h2>
      <ul>
        <li>For periodized programs (e.g., Hypertrophy → Strength → Power)</li>
        <li>
          For clearly defined training cycles (e.g., 4 weeks on, 1 week deload)
        </li>
        <li>When coaching athletes and assigning multi-phase progressions</li>
      </ul>

      <p>
        Looking for help with saving or exporting? Check out{" "}
        <a href="/help/save-preview">Saving and Previewing</a>.
      </p>
    </div>
  );
}
