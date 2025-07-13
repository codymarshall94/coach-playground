import {
  BookOpenCheck,
  Dumbbell,
  LayoutList,
  LucideIcon,
  Sparkles,
} from "lucide-react";

export type HelpArticle = {
  title: string;
  slug: string; // e.g., "creating-your-first-workout"
  href: string; // full path: "/help/creating-your-first-workout"
  section: string; // e.g., "Getting Started"
  excerpt: string; // short description for previews or search
  tags?: string[]; // e.g., ["builder", "beginner", "setup"]
  featured?: boolean; // optional: for homepage "Most Read"
  updatedAt?: string; // ISO string (or Date) for sorting
  icon?: LucideIcon; // optional: override icon in search/list
};

export const helpArticles: HelpArticle[] = [
  {
    title: "Creating Your First Workout Plan",
    slug: "creating-your-first-workout",
    href: "/help/creating-your-first-workout",
    section: "Getting Started",
    excerpt: "Learn how to structure your first training program from scratch.",
    tags: ["builder", "beginner", "programming"],
    featured: true,
    updatedAt: "2024-06-01",
    icon: BookOpenCheck,
  },
  {
    title: "Navigating the Builder",
    slug: "navigating-builder",
    href: "/help/navigating-builder",
    section: "Getting Started",
    excerpt: "Explore the interface for adding days, blocks, and more.",
    tags: ["ui", "builder", "workflow"],
    updatedAt: "2024-06-12",
  },
  {
    title: "Using the Exercise Library",
    slug: "exercise-library",
    href: "/help/exercise-library",
    section: "Adding Exercises",
    excerpt:
      "Search and filter through hundreds of movements to add to your plan.",
    tags: ["exercises", "library", "search"],
    icon: Dumbbell,
  },
  {
    title: "Advanced Set Types",
    slug: "set-types",
    href: "/help/set-types",
    section: "Adding Exercises",
    excerpt: "Learn how to use AMRAP, cluster sets, back-offs and more.",
    tags: ["advanced", "set types", "intensity"],
  },
  {
    title: "Reordering Days",
    slug: "reorder-days",
    href: "/help/reorder-days",
    section: "Workout Organization",
    excerpt: "Drag-and-drop training days to adjust your weekly flow.",
    tags: ["days", "order", "schedule"],
    icon: LayoutList,
  },
  {
    title: "Using Blocks",
    slug: "using-blocks",
    href: "/help/using-blocks",
    section: "Workout Organization",
    excerpt:
      "Structure your training into progressive blocks for better results.",
    tags: ["blocks", "periodization"],
  },
  {
    title: "What is PRGRM?",
    slug: "what-is-prgrm",
    href: "/help/what-is-prgrm",
    section: "About PRGRM",
    excerpt: "Get an overview of PRGRM’s training philosophy and tools.",
    icon: Sparkles,
  },
  {
    title: "Who is PRGRM for?",
    slug: "who-is-prgrm-for",
    href: "/help/who-is-prgrm-for",
    section: "About PRGRM",
    excerpt: "PRGRM is for anyone who wants to improve their training.",
  },
  {
    title: "Why PRGRM vs. Spreadsheets?",
    slug: "why-prgrm",
    href: "/help/why-prgrm",
    section: "About PRGRM",
    excerpt:
      "PRGRM is a platform for creating and managing your training programs.",
  },
  {
    title: "Is PRGRM Free?",
    slug: "is-prgrm-free",
    href: "/help/is-prgrm-free",
    section: "About PRGRM",
    excerpt:
      "PRGRM is a platform for creating and managing your training programs.",
  },
  {
    title: "Can I Use PRGRM as a Coach?",
    slug: "coach-mode",
    href: "/help/coach-mode",
    section: "About PRGRM",
    excerpt:
      "PRGRM is a platform for creating and managing your training programs.",
  },
];
