"use client";

import { Button } from "@/components/ui/button";
import { Program } from "@/types/Workout";
import { DEFAULT_PDF_LAYOUT, PDFLayoutConfig } from "@/types/PDFLayout";
import { ArrowLeft, Download, Loader2, Save, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { savePdfConfig } from "@/services/programService";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PDFLayoutSidebar } from "./PDFLayoutSidebar";
import { PDFPreviewSheet } from "./PDFPreviewSheet";

interface PDFLayoutPlannerProps {
  program: Program;
  onClose: () => void;
}

/** Merge saved config with defaults so new fields always have a value. */
function hydrateConfig(saved: Partial<PDFLayoutConfig> | null | undefined): PDFLayoutConfig {
  if (!saved) return { ...DEFAULT_PDF_LAYOUT };
  return { ...DEFAULT_PDF_LAYOUT, ...saved, branding: { ...DEFAULT_PDF_LAYOUT.branding, ...saved.branding } };
}

export function PDFLayoutPlanner({ program, onClose }: PDFLayoutPlannerProps) {
  const { profile } = useUserProfile();

  // ── Initialise config from saved program data ──
  const [config, setConfig] = useState<PDFLayoutConfig>(() =>
    hydrateConfig(program.pdf_config as Partial<PDFLayoutConfig> | null)
  );
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(() => {
    if (typeof window === "undefined") return 75;
    const stored = localStorage.getItem("pdf-designer-zoom");
    return stored ? Number(stored) : 75;
  });

  // Persist zoom in localStorage
  useEffect(() => {
    localStorage.setItem("pdf-designer-zoom", String(zoom));
  }, [zoom]);

  // Track whether the user has made any change (to avoid no-op saves)
  const initialConfigRef = useRef<string>(JSON.stringify(config));
  const dirty = JSON.stringify(config) !== initialConfigRef.current;

  // ── Pre-fill branding from user profile on first open ──
  const brandingPrefilled = useRef(false);
  useEffect(() => {
    if (brandingPrefilled.current) return;
    if (!profile) return;

    // Only pre-fill if the config has no branding info at all
    const b = config.branding;
    if (b.coachName || b.tagline || b.logoUrl) {
      brandingPrefilled.current = true;
      return;
    }

    const brandName = profile.brand_name || profile.full_name || "";
    const logoUrl = profile.logo_url || "";

    if (brandName || logoUrl) {
      setConfig((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          coachName: brandName,
          logoUrl,
        },
      }));
    }
    brandingPrefilled.current = true;
  }, [profile, config.branding]);

  // ── Debounced auto-save ──
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!dirty) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        await savePdfConfig(
          program.id,
          config as unknown as Record<string, unknown>,
        );
        initialConfigRef.current = JSON.stringify(config);
      } catch (err) {
        console.error("Auto-save PDF config failed:", err);
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [config, dirty, program.id]);

  // ── Export ──
  const exportToPDF = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program, config }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("PDF export failed:", errorText);
        toast.error("PDF export failed", {
          description: "Something went wrong generating your PDF. Please try again.",
        });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${program.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF exported", {
        description: `${program.name}.pdf has been downloaded.`,
      });
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("PDF export failed", {
        description: "A network error occurred. Please check your connection and try again.",
      });
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
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <button
              type="button"
              className="text-xs text-muted-foreground w-10 text-center hover:text-foreground transition-colors"
              onClick={() => setZoom(75)}
              title="Reset to 75%"
            >
              {zoom}%
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              disabled={zoom >= 150}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="h-5 w-px bg-border" />

          {saving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Save className="w-3 h-3 animate-pulse" />
              Saving…
            </span>
          )}
          {!saving && dirty && (
            <span className="text-xs text-muted-foreground">Unsaved</span>
          )}
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
        </div>
      </header>

      {/* ── Main content: sidebar + preview ── */}
      <div className="flex flex-1 overflow-hidden">
        <PDFLayoutSidebar config={config} onChange={setConfig} />
        <main className="flex-1 bg-muted/30 overflow-hidden">
          <PDFPreviewSheet program={program} config={config} zoom={zoom} />
        </main>
      </div>
    </div>
  );
}
