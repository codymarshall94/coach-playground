import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  {
    title: "How to create your first workout plan",
    href: "/help/creating-your-first-workout",
    description: "Step-by-step guide to building your first workout routine",
  },
  {
    title: "Understanding program analytics",
    href: "/help/program-analytics",
    description: "Score, stress grid, muscle map, and coach suggestions",
  },
  {
    title: "How to export as a PDF",
    href: "/help/export-pdf",
    description: "Export your workout plans for offline use",
  },
  {
    title: "Exercise groups & supersets",
    href: "/help/exercise-groups",
    description: "Pair exercises into supersets, giant sets, or circuits",
  },
  {
    title: "How to save and preview",
    href: "/help/save-preview",
    description: "Save your progress and preview your workouts",
  },
  {
    title: "Frequently asked questions",
    href: "/help/faq",
    description: "What PRGRM is, who it's for, pricing, and more",
  },
];

export function MostReadArticles() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Most Read Articles</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {articles.map((article, index) => (
            <Link
              key={article.href}
              href={article.href}
              className="group block px-6 py-4 hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-base group-hover:text-primary transition-colors mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
