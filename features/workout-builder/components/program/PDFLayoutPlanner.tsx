"use client";

import { Button } from "@/components/ui/button";
import { Program } from "@/types/Workout";
import { DEFAULT_PDF_LAYOUT, PDFLayoutConfig } from "@/types/PDFLayout";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { PDFLayoutSidebar } from "./PDFLayoutSidebar";
import { PDFPreviewSheet } from "./PDFPreviewSheet";

interface PDFLayoutPlannerProps {
  program: Program;
  onClose: () => void;
}

export function PDFLayoutPlanner({ program, onClose }: PDFLayoutPlannerProps) {
  const [config, setConfig] = useState<PDFLayoutConfig>(DEFAULT_PDF_LAYOUT);
  const [exporting, setExporting] = useState(false);

  const exportToPDF = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program, config }),
      });

      if (!res.ok) {
        console.error("PDF export failed:", await res.text());
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${program.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [program, config]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* ── Top bar ── */}
      <header className="h-14 shrink-0 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to editor
          </Button>
          <div className="h-5 w-px bg-border" />
          <div>
            <span className="text-sm font-semibold">{program.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              PDF Layout Planner
            </span>
          </div>
        </div>
        <Button onClick={exportToPDF} disabled={exporting} className="gap-2">
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export PDF
            </>
          )}
        </Button>
      </header>

      {/* ── Main content: sidebar + preview ── */}
      <div className="flex flex-1 overflow-hidden">
        <PDFLayoutSidebar config={config} onChange={setConfig} />
        <main className="flex-1 bg-muted/30 overflow-hidden">
          <PDFPreviewSheet program={program} config={config} />
        </main>
      </div>
    </div>
  );
}
