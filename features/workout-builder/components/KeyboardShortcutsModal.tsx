"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, Keyboard } from "lucide-react";
import { useEffect } from "react";

interface ShortcutItem {
  keys: string[];
  description: string;
  category?: string;
}

const shortcuts: ShortcutItem[] = [
  {
    keys: ["→"],
    description: "Go to next workout day",
    category: "Navigation",
  },
  {
    keys: ["←"],
    description: "Go to previous workout day",
    category: "Navigation",
  },
  {
    keys: ["L"],
    description: "Open Exercise Library",
    category: "Actions",
  },
  {
    keys: ["Shift", "X"],
    description: "Clear current workout day",
    category: "Actions",
  },
  {
    keys: ["I"],
    description: "Toggle workout insights",
    category: "Actions",
  },
  {
    keys:
      typeof window !== "undefined" && /Mac/i.test(navigator.platform)
        ? ["⌘", "S"]
        : ["Ctrl", "S"],
    description: "Save draft",
    category: "Actions",
  },
  {
    keys: ["P"],
    description: "Preview workout",
    category: "Actions",
  },
  {
    keys: ["Shift", "?"],
    description: "Show keyboard shortcuts",
    category: "Help",
  },
];

const KeyboardShortcut = ({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-muted-foreground">{description}</span>
    <div className="flex gap-1">
      {keys.map((key, index) => (
        <div key={index} className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-xs text-muted-foreground">+</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Open modal with Shift + ?
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "?") {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  {category}
                </h3>
                <div className="space-y-1">
                  {categoryShortcuts.map((shortcut, index) => (
                    <KeyboardShortcut
                      key={index}
                      keys={shortcut.keys}
                      description={shortcut.description}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
