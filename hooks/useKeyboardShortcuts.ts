import { useEffect } from "react";

interface ShortcutsOptions {
  onNextDay?: () => void;
  onPreviousDay?: () => void;
  onOpenLibrary?: () => void;
  onToggleCollapseAll?: () => void;
  onClearAll?: () => void;
  onToggleInsights?: () => void;
  onSaveDraft?: () => void;
  onPreview?: () => void;
  onOpenHelpModal?: () => void;
}

export function useKeyboardShortcuts({
  onNextDay,
  onPreviousDay,
  onOpenLibrary,
  onClearAll,
  onToggleInsights,
  onSaveDraft,
  onPreview,
  onToggleCollapseAll,
  onOpenHelpModal,
}: ShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.shiftKey && key === "?") {
        e.preventDefault();
        onOpenHelpModal?.();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        onSaveDraft?.();
        return;
      }

      // Ignore input fields
      const tag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA"].includes(tag)) return;

      switch (key) {
        case "arrowright":
          onNextDay?.();
          break;
        case "arrowleft":
          onPreviousDay?.();
          break;
        case "e":
          onToggleCollapseAll?.();
          break;
        case "l":
          onOpenLibrary?.();
          break;
        case "i":
          onToggleInsights?.();
          break;
        case "p":
          onPreview?.();
          break;
        case "x":
          if (e.shiftKey) {
            onClearAll?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onNextDay,
    onPreviousDay,
    onOpenLibrary,
    onToggleCollapseAll,
    onClearAll,
    onToggleInsights,
    onSaveDraft,
    onPreview,
    onOpenHelpModal,
  ]);
}
