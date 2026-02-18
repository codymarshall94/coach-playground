import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function SavePreviewHelp() {
  return (
    <HelpArticle title="Saving and Previewing Your Program">
      <h2>Saving Your Work</h2>
      <p>
        Click <strong>Save Draft</strong> in the top-right toolbar at any time
        to persist your program. You&apos;ll need to be signed in — if
        you&apos;re not, PRGRM will prompt you to log in first.
      </p>
      <ul>
        <li>
          <strong>First save</strong> — creates the program in your account.
        </li>
        <li>
          <strong>Subsequent saves</strong> — updates the existing program
          in-place (no duplicates).
        </li>
        <li>
          Your programs are listed at{" "}
          <a href="/programs">Your Programs</a> and sorted by last updated.
        </li>
      </ul>

      <h2>Previewing Your Program</h2>
      <p>
        Click <strong>Preview</strong> in the top-right toolbar to open a
        full-screen view of your entire program. The preview shows:
      </p>
      <ul>
        <li>Every day laid out with exercises, sets, reps, and intensity</li>
        <li>Rest periods and advanced set type details</li>
        <li>Day notes and exercise notes</li>
        <li>Block names and week counts (if using blocks mode)</li>
      </ul>
      <p>
        From the preview you can also <strong>Export to PDF</strong> — see{" "}
        <a href="/help/export-pdf">Exporting as a PDF</a> for details.
      </p>

      <h2>Auto-Save?</h2>
      <p>
        PRGRM does not auto-save. This is intentional — it lets you experiment
        freely without worrying about overwriting your saved version. Just hit{" "}
        <strong>Save Draft</strong> when you&apos;re happy with your changes.
      </p>

      <h2>Tips</h2>
      <ul>
        <li>
          Save frequently, especially before closing the browser tab.
        </li>
        <li>
          Use Preview to double-check your program before sharing or exporting.
        </li>
        <li>
          If you want to try a variation, duplicate the program from{" "}
          <a href="/programs">Your Programs</a> first.
        </li>
      </ul>
    </HelpArticle>
  );
}
