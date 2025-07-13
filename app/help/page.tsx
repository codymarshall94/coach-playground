import { HelpSearch } from "@/features/help/components/HelpSearch";
import { MostReadArticles } from "@/features/help/components/MostReadArticles";

export default function HelpHomePage() {
  return (
    <div className="relative max-w-7xl mx-auto py-16 px-4 space-y-16">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PRGRM Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here for all your training-related questions
          </p>
        </div>
        <div className="max-w-lg mx-auto">
          <HelpSearch />
        </div>
      </div>

      <div className="space-y-8">
        <MostReadArticles />
      </div>
    </div>
  );
}
