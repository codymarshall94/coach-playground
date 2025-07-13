import Image from "next/image";

export default function ReorderDaysHelp() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Reordering Workout Days</h1>
      <p>
        You can customize the order of your program days at any time using the
        left sidebar. The order you see is the order used in previews and PDF
        exports.
      </p>

      <h2>Reordering Days</h2>
      <p>
        To move a day, click and drag the <strong>grip icon</strong> next to any
        workout or rest day. The number will automatically update based on its
        new position.
      </p>
      <Image
        src="/images/help/day-order-sidebar.png"
        alt="Sidebar showing Push, Pull, Legs, and Rest days"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Renaming Days</h2>
      <p>
        To give your day a custom name, like “Push” or “Legs”, click the pencil
        icon next to the name. Press enter or click the checkmark to save.
      </p>
      <Image
        src="/images/help/day-rename.png"
        alt="Renaming a day using the pencil icon"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Adding Day Notes</h2>
      <p>
        Use <strong>Work Day Notes</strong> to describe the goal or intention of
        the day. These notes are visible in preview and PDF formats, giving
        context to each training day.
      </p>
      <Image
        src="/images/help/day-notes.png"
        alt="Popup with notes about the day's purpose"
        width={400}
        height={200}
        className="rounded border"
      />

      <p>
        Want to organize days into training blocks instead of a flat list? Check
        out <a href="/help/using-blocks">Using Blocks</a>.
      </p>
    </div>
  );
}
