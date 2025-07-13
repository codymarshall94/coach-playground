import Image from "next/image";

export default function CreatingYourFirstWorkout() {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>Creating Your First Workout Plan</h1>
      <p>
        Welcome to the PRGRM Builder! This is where you’ll create structured
        training plans by adding workout days, exercises, sets, and rest days.
        Follow the steps below to create your first plan.
      </p>

      <h2>Step 1: Start a New Program</h2>
      <p>
        From your dashboard, click <strong>“New Program”</strong> to get
        started. You’ll be taken to the builder with your first day already
        created.
      </p>
      <Image
        src="/images/help/builder-empty.png"
        alt="Empty builder with one day and no exercises"
        width={400}
        height={200}
        layout="responsive"
        className="rounded border"
      />

      <h2>Step 2: Add Workout or Rest Days</h2>
      <p>
        Use the left sidebar to add more days to your program. Click{" "}
        <strong>Add Workout Day</strong> to include another training day or{" "}
        <strong>Add Rest Day</strong> to schedule a recovery day.
      </p>
      <Image
        src="/images/help/add-workout-day.png"
        alt="Add workout day and rest day buttons"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Step 3: Add Your First Exercise</h2>
      <p>
        On any workout day, click <strong>Add First Exercise</strong>. This will
        open the exercise library where you can browse by category, equipment,
        or muscle group.
      </p>
      <Image
        src="/images/help/exercise-library.png"
        alt="Exercise library modal showing filter options"
        width={400}
        height={200}
        className="rounded border"
      />

      <p>
        After selecting an exercise, it will be added to the current day. You
        can always reorder or remove exercises later.
      </p>
      <Image
        src="/images/help/exercise-added.png"
        alt="Workout day with one exercise added"
        width={600}
        height={300}
        className="rounded border"
      />

      <h2>Step 4: Customize Sets</h2>
      <p>
        Each exercise includes a list of sets. You can customize the reps, RPE,
        rest, and notes for each set. Advanced set types (e.g. drop sets) can be
        configured too.
      </p>
      <Image
        src="/images/help/set-editor.png"
        alt="Exercise set editor with reps, RPE, and rest fields"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Step 5: Save or Preview</h2>
      <p>
        Use the buttons in the top-right to <strong>Save Draft</strong> or{" "}
        <strong>Preview</strong> your plan. Preview lets you see how the full
        program will look when completed.
      </p>
      <Image
        src="/images/help/save-preview-buttons.png"
        alt="Top-right Save Draft and Preview buttons"
        width={400}
        height={200}
        className="rounded border"
      />

      <h2>Tips</h2>
      <ul>
        <li>Use “Suggestions” to get exercise ideas based on muscle groups.</li>
        <li>Use notes to include technique cues or tempo.</li>
        <li>Click and drag to reorder exercises or days.</li>
      </ul>

      <p>
        Once your plan is complete, you can export it as a PDF or continue
        editing anytime. Need help? Return to the{" "}
        <a href="/help">Help Center</a> or contact support.
      </p>
    </div>
  );
}
