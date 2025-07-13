import Image from "next/image";

export default function NavigatingBuilder() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Navigating the PRGRM Builder</h1>
      <p>
        The PRGRM builder is designed to give you full control over your
        training split. Here&apos;s a quick tour of how the interface is
        organized.
      </p>

      <h2>1. Layout Overview</h2>
      <p>
        When you enter the builder, you&apos;ll see the layout split into three
        main areas:
      </p>
      <ul>
        <li>
          <strong>Sidebar (Left):</strong> List of days in your program
        </li>
        <li>
          <strong>Main Canvas (Center):</strong> The active day you&apos;re
          editing
        </li>
        <li>
          <strong>Top Bar (Top Right):</strong> Global actions like saving and
          previewing
        </li>
      </ul>
      <Image
        src="/images/help/builder-empty.png"
        alt="Builder layout overview"
        width={700}
        height={400}
        className="rounded border"
      />

      <h2>2. Sidebar Navigation</h2>
      <p>
        Use the left sidebar to move between workout and rest days. You can
        rename each day by clicking the pencil icon or reorder them by dragging
        the handles.
      </p>
      <Image
        src="/images/help/add-workout-day.png"
        alt="Workout days in the sidebar"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>3. Main Canvas</h2>
      <p>This area updates depending on the selected day. You&apos;ll see:</p>
      <ul>
        <li>“Add First Exercise” if the day is empty</li>
        <li>Exercises and sets if already added</li>
        <li>A simple label for rest days</li>
      </ul>
      <Image
        src="/images/help/add-rest-day.png"
        alt="Example of a rest day on the canvas"
        width={700}
        height={400}
        className="rounded border"
      />

      <h2>4. Top Bar Actions</h2>
      <p>In the top-right corner, you&apos;ll find buttons to:</p>
      <ul>
        <li>
          <strong>Save Draft:</strong> Save progress at any time
        </li>
        <li>
          <strong>Preview:</strong> See a full-screen view of the program
        </li>
        <li>
          <strong>Exercise Library:</strong> Browse and insert exercises
        </li>
      </ul>
      <Image
        src="/images/help/save-preview-buttons.png"
        alt="Top bar buttons: Save Draft and Preview"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>5. Tips and Shortcuts</h2>
      <ul>
        <li>
          <strong>Collapse All:</strong> Minimizes all exercises to declutter
          view
        </li>
        <li>
          <strong>Clear All:</strong> Resets the current day
        </li>
        <li>
          <strong>Drag to reorder:</strong> Move exercises or days easily
        </li>
      </ul>

      <p>
        That&apos;s it! You&apos;re ready to start building. Head back to{" "}
        <a href="/help/creating-your-first-workout">
          Creating Your First Workout
        </a>{" "}
        if you&apos;re just getting started.
      </p>
    </div>
  );
}
