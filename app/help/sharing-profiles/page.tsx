import { HelpArticle } from "@/features/help/components/HelpArticle";

export default function SharingProfilesHelp() {
  return (
    <HelpArticle title="Sharing & Public Profiles">
      <p>
        PRGRM lets you share your programs publicly through a personal profile
        page. This is especially useful for coaches sending plans to clients, or
        athletes sharing their training with friends.
      </p>

      <h2>Setting Up Your Profile</h2>
      <ol>
        <li>Sign in to your PRGRM account.</li>
        <li>
          Open your avatar menu (top-right) and go to your profile settings.
        </li>
        <li>
          Choose a <strong>username slug</strong> — this becomes your public URL
          (e.g., <code>prgrm.app/u/yourname</code>).
        </li>
        <li>Add your display name and bio so visitors know who you are.</li>
      </ol>

      <h2>Sharing a Program</h2>
      <p>
        Once your profile is set up and you&apos;ve saved a program, it&apos;s
        accessible at your public profile URL. Share that link with anyone — no
        account needed to view.
      </p>

      <h2>PDF vs. Link</h2>
      <ul>
        <li>
          <strong>PDF export</strong> — best for handing off a static plan
          (print it, email it). See{" "}
          <a href="/help/export-pdf">Exporting as a PDF</a>.
        </li>
        <li>
          <strong>Public profile link</strong> — best for a living link that
          always shows your latest programs.
        </li>
      </ul>

      <h2>Privacy</h2>
      <p>
        Only programs you explicitly publish are visible on your public profile.
        Draft programs and your builder workspace are always private.
      </p>
    </HelpArticle>
  );
}
