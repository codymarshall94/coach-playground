import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function ExportPdfHelp() {
  return (
    <HelpArticle title="Exporting Your Program as a PDF">
      <p>
        PRGRM lets you export any program as a clean, printable PDF — perfect
        for handing off to clients or keeping in your gym bag.
      </p>

      <h2>How to Export</h2>
      <ol>
        <li>
          Open your program in the builder and click <strong>Preview</strong> in
          the top-right toolbar.
        </li>
        <li>
          In the preview dialog you&apos;ll see your full program laid out by
          day, with exercises, sets, reps, intensity, and rest.
        </li>
        <li>
          Click <strong>Export to PDF</strong>. The file will download
          automatically with your program name as the filename.
        </li>
      </ol>

      <h2>What&apos;s Included in the PDF</h2>
      <ul>
        <li>Program name, goal, and description</li>
        <li>Every training day with exercise names, sets, reps, and intensity</li>
        <li>Rest periods and set types (drop sets, clusters, etc.)</li>
        <li>Day and exercise notes</li>
        <li>Block names and week counts (if using blocks mode)</li>
      </ul>

      <h2>Tips</h2>
      <ul>
        <li>
          Add day notes and exercise notes before exporting — they show up in
          the PDF and give your client important context.
        </li>
        <li>
          Give your program a clear name and description so the PDF is
          self-explanatory.
        </li>
        <li>
          The PDF uses a clean layout optimized for printing — no need to
          adjust anything.
        </li>
      </ul>

      <p>
        Want to share digitally instead? See{" "}
        <a href="/help/sharing-profiles">Sharing &amp; Public Profiles</a>.
      </p>
    </HelpArticle>
  );
}
