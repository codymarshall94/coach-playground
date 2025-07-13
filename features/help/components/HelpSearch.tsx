"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { Clock, ExternalLink, FileText, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHelpSearch } from "../hooks/useHelpSearch";

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debounced = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useHelpSearch(debounced);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
        <Input
          ref={inputRef}
          placeholder="Search help articles..."
          className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-200 rounded-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="p-2 text-xs text-muted-foreground border-b bg-muted/30">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              {results.map((article, index) => (
                <a
                  key={article.slug}
                  href={article.href}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0 group"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </h4>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {article.section && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {article.section}
                          </span>
                        )}
                        {article.updatedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {article.updatedAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : debounced.trim() ? (
            <div className="relative p-8 text-center overflow-hidden">
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center border-2 border-blue-200 shadow-lg">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          />
                        </div>
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-3 bg-gray-300" />
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Search className="w-3 h-3 text-white" />
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Oops! No results found
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Our search couldn't find anything for{" "}
                  <span className="font-medium text-foreground">
                    "{debounced}"
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
