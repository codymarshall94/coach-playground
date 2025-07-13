import Fuse from "fuse.js";
import { helpArticles } from "../data/helpArticles";

export function useHelpSearch(query: string) {
  const fuse = new Fuse(helpArticles, {
    keys: ["title", "excerpt", "section"],
    threshold: 0.3,
  });

  if (!query.trim()) return [];

  return fuse.search(query).map((r) => r.item);
}
