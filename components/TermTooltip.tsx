import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GLOSSARY_TERMS, type GlossaryTerm } from "@/constants/glossary";

export const TermTooltip = ({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) => {
  const entry: GlossaryTerm | undefined = GLOSSARY_TERMS.find(
    (t) =>
      t.key.toLowerCase() === term.toLowerCase() ||
      t.label.toLowerCase().replace(" ", "_") === term.toLowerCase()
  );

  if (!entry) return <>{children}</>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="max-w-sm text-sm text-muted-foreground">
        <strong className="font-semibold">{entry.label}</strong>
        <p className="text-muted-foreground text-sm mt-1">{entry.definition}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
