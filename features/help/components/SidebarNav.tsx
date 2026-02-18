"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpenCheck,
  Dumbbell,
  FileDown,
  HelpCircle,
  LayoutList,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpArticle, helpArticles } from "../data/helpArticles";

const helpSections = [
  {
    title: "Getting Started",
    icon: BookOpenCheck,
  },
  {
    title: "Adding Exercises",
    icon: Dumbbell,
  },
  {
    title: "Workout Organization",
    icon: LayoutList,
  },
  {
    title: "Saving & Sharing",
    icon: FileDown,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "FAQ",
    icon: HelpCircle,
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
            {(articlesBySection[section.title] ?? []).map((article) => {
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
