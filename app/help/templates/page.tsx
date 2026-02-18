import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function TemplatesHelp() {
  return (
    <HelpArticle title="Browsing & Using Templates">
      <p>
        Templates are pre-built programs you can start from instead of building
        from scratch. They&apos;re a great way to learn good program structure
        or save time.
      </p>

      <h2>Finding Templates</h2>
      <p>
        Go to{" "}
        <a href="/programs/templates">Browse Templates</a> (also linked from
        the dashboard when you have no programs). You&apos;ll see a collection
        of programs organized by goal — strength, hypertrophy, endurance, and
        power.
      </p>

      <h2>Using a Template</h2>
      <ol>
        <li>Browse or filter templates by goal or training style.</li>
        <li>
          Click a template to open it. A copy is created in your builder so
          the original stays untouched.
        </li>
        <li>
          Customize anything — swap exercises, change sets, rename days, add
          blocks.
        </li>
        <li>
          Save it as your own program when you&apos;re done.
        </li>
      </ol>

      <h2>When to Use Templates</h2>
      <ul>
        <li>
          <strong>New to programming?</strong> Templates show you how a
          well-structured plan looks.
        </li>
        <li>
          <strong>Short on time?</strong> Start from something close, then
          tweak to fit.
        </li>
        <li>
          <strong>Coaching clients?</strong> Use templates as starting points
          for client-specific programs.
        </li>
      </ul>

      <p>
        Ready to build from scratch instead? See{" "}
        <a href="/help/creating-your-first-workout">
          Creating Your First Workout
        </a>.
      </p>
    </HelpArticle>
  );
}
