"use client";

import { cn } from "@/lib/utils";
import { BookOpenCheck, Dumbbell, LayoutList, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpArticle, helpArticles } from "../data/helpArticles";

const helpSections = [
  {
    title: "Getting Started",
    icon: BookOpenCheck,
    items: [
      {
        title: "Creating Your First Workout Plan",
        href: "/help/creating-your-first-workout",
      },
      { title: "Navigating the Builder", href: "/help/navigating-builder" },
    ],
  },
  {
    title: "Adding Exercises",
    icon: Dumbbell,
    items: [
      { title: "Using the Exercise Library", href: "/help/exercise-library" },
      { title: "Advanced Set Types", href: "/help/set-types" },
    ],
  },
  {
    title: "Workout Organization",
    icon: LayoutList,
    items: [
      { title: "Reordering Days", href: "/help/reorder-days" },
      { title: "Using Blocks", href: "/help/using-blocks" },
    ],
  },
  {
    title: "About PRGRM",
    icon: Sparkles,
    items: [
      { title: "What is PRGRM?", href: "/help/what-is-prgrm" },
      { title: "Who is PRGRM for?", href: "/help/who-is-prgrm-for" },
      { title: "Why PRGRM vs. Spreadsheets?", href: "/help/why-prgrm" },
      { title: "Is PRGRM Free?", href: "/help/is-prgrm-free" },
      { title: "Can I Use PRGRM as a Coach?", href: "/help/coach-mode" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  const articlesBySection = helpArticles.reduce((acc, article) => {
    acc[article.section] ||= [];
    acc[article.section].push(article);
    return acc;
  }, {} as Record<string, HelpArticle[]>);

  return (
    <nav className="space-y-8">
      {helpSections.map((section) => (
        <div key={section.title}>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {section.icon && <section.icon className="w-4 h-4" />}
            {section.title}
          </div>
          <ul className="space-y-1 pl-1">
            {articlesBySection[section.title].map((article) => {
              const isActive = pathname === article.href;
              return (
                <li key={article.href}>
                  <Link
                    href={article.href}
                    className={cn(
                      "text-sm rounded-md px-2 py-1.5 flex items-center gap-2 transition-colors",
                      isActive
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="truncate">{article.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
