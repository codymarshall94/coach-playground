import {
  BarChart3,
  BookOpenCheck,
  Dumbbell,
  FileDown,
  HelpCircle,
  LayoutList,
  LucideIcon,
  Share2,
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
  // ── Getting Started ──
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
    title: "Browsing & Using Templates",
    slug: "templates",
    href: "/help/templates",
    section: "Getting Started",
    excerpt:
      "Start from a pre-built template instead of building from scratch.",
    tags: ["templates", "beginner", "getting started"],
    updatedAt: "2026-02-17",
  },

  // ── Adding Exercises ──
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
    title: "Exercise Groups: Supersets & More",
    slug: "exercise-groups",
    href: "/help/exercise-groups",
    section: "Adding Exercises",
    excerpt:
      "Pair exercises into supersets, giant sets, or circuits for efficient sessions.",
    tags: ["supersets", "giant sets", "circuits", "grouping"],
    updatedAt: "2026-02-17",
  },
  {
    title: "Intensity Systems: RPE, RIR & %1RM",
    slug: "intensity-systems",
    href: "/help/intensity-systems",
    section: "Adding Exercises",
    excerpt:
      "Understand and switch between RPE, RIR, and percentage-based intensity.",
    tags: ["rpe", "rir", "1rm", "intensity", "effort"],
    updatedAt: "2026-02-17",
  },

  // ── Workout Organization ──
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

  // ── Saving & Sharing ──
  {
    title: "Saving & Previewing",
    slug: "save-preview",
    href: "/help/save-preview",
    section: "Saving & Sharing",
    excerpt:
      "Save your progress, preview the full program, and pick up where you left off.",
    tags: ["save", "preview", "draft"],
    updatedAt: "2026-02-17",
    icon: FileDown,
  },
  {
    title: "Exporting as a PDF",
    slug: "export-pdf",
    href: "/help/export-pdf",
    section: "Saving & Sharing",
    excerpt: "Download a clean, printable PDF of your program in one click.",
    tags: ["pdf", "export", "download", "print"],
    featured: true,
    updatedAt: "2026-02-17",
    icon: FileDown,
  },
  {
    title: "Sharing & Public Profiles",
    slug: "sharing-profiles",
    href: "/help/sharing-profiles",
    section: "Saving & Sharing",
    excerpt:
      "Set up your public profile and share programs via a personal link.",
    tags: ["share", "profile", "public", "coach"],
    updatedAt: "2026-02-17",
    icon: Share2,
  },

  // ── Analytics ──
  {
    title: "Understanding Program Analytics",
    slug: "program-analytics",
    href: "/help/program-analytics",
    section: "Analytics",
    excerpt:
      "Program score, stress grid, intensity mix, muscle map, balance meters, and coach suggestions — explained.",
    tags: [
      "analytics",
      "score",
      "volume",
      "intensity",
      "muscle",
      "balance",
      "coach",
    ],
    featured: true,
    updatedAt: "2026-02-17",
    icon: BarChart3,
  },

  // ── FAQ ──
  {
    title: "Frequently Asked Questions",
    slug: "faq",
    href: "/help/faq",
    section: "FAQ",
    excerpt:
      "Quick answers: what PRGRM is, who it's for, pricing, goals, and more.",
    tags: ["faq", "about", "free", "coach", "goals"],
    updatedAt: "2026-02-17",
    icon: HelpCircle,
  },
];
