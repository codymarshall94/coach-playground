"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Warns users before they leave the page with unsaved changes.
 *
 * Covers two scenarios:
 *  1. **Tab close / refresh / external navigation** → `beforeunload` event
 *     (browser shows its own generic confirmation dialog).
 *  2. **In-app link clicks** → captures clicks on `<a>` elements that would
 *     trigger a client-side navigation and shows a `window.confirm` prompt.
 *
 * Usage:
 * ```ts
 * const { markClean, isDirty } = useUnsavedChanges(hasUnsavedWork);
 * // call markClean() after a successful save
 * ```
 */
export function useUnsavedChanges(dirty: boolean) {
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  // ── beforeunload (tab close / refresh / external nav) ──────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      // Legacy browsers need returnValue set
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // ── In-app navigation guard (link clicks) ──────────────────────────
  // Next.js App Router doesn't expose a routeChangeStart event.
  // We capture click events on <a> elements that point to an internal route
  // and confirm before allowing navigation.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dirtyRef.current) return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

      // Internal link — confirm before proceeding
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Use capture phase so we run before Next.js handles the click
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  // ── Browser back / forward button guard ────────────────────────────
  useEffect(() => {
    const handler = () => {
      if (!dirtyRef.current) return;

      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!ok) {
        // Push a dummy state to "undo" the back/forward
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Push an initial state so popstate fires on back
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const markClean = useCallback(() => {
    dirtyRef.current = false;
  }, []);

  return { markClean, isDirty: dirty };
}
