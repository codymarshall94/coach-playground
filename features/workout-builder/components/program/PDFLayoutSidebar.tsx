"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_PDF_LAYOUT,
  PDF_THEMES,
  PDFLayoutConfig,
  PDFThemeId,
  PDFFontSize,
  PDFTableDensity,
  PDFPageBreak,
} from "@/types/PDFLayout";
import { cn } from "@/lib/utils";
import {
  Check,
  Palette,
  RotateCcw,
  Type,
  Eye,
  EyeOff,
  Rows3,
  FileText,
  Scissors,
  User,
  Image,
  Upload,
} from "lucide-react";

interface PDFLayoutSidebarProps {
  config: PDFLayoutConfig;
  onChange: (config: PDFLayoutConfig) => void;
}

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
        {label}
      </h3>
    </div>
  );
}

function ThemeCard({
  themeId,
  selected,
  onClick,
}: {
  themeId: PDFThemeId;
  selected: boolean;
  onClick: () => void;
}) {
  const theme = PDF_THEMES[themeId];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-lg border-2 p-2.5 text-left transition-all w-full",
        "hover:border-primary/50 hover:shadow-sm",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      {/* Mini preview swatch */}
      <div className="flex gap-1.5 mb-2">
        <div
          className="w-full h-6 rounded-sm"
          style={{ background: theme.heroGradient }}
        />
      </div>
      <div className="flex gap-1 mb-1.5">
        <div
          className="h-2 rounded-sm flex-1"
          style={{ background: theme.tableHeaderBg }}
        />
        <div
          className="h-2 rounded-sm flex-[2]"
          style={{ background: theme.tableAltRowBg }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold">{theme.label}</span>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {theme.description}
          </p>
        </div>
        {selected && (
          <Check className="w-4 h-4 text-primary shrink-0" />
        )}
      </div>
    </button>
  );
}

const PRESET_COLORS = [
  "#1e1b4b", // indigo deep
  "#172554", // blue deep
  "#14532d", // green deep
  "#7c2d12", // burnt orange
  "#7f1d1d", // crimson
  "#581c87", // purple deep
  "#164e63", // teal deep
  "#1c1917", // stone dark
  "#0c4a6e", // sky deep
  "#713f12", // amber dark
  "#365314", // lime deep
  "#000000", // black
];

export function PDFLayoutSidebar({ config, onChange }: PDFLayoutSidebarProps) {
  const update = <K extends keyof PDFLayoutConfig>(
    key: K,
    value: PDFLayoutConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const updateBranding = (
    key: keyof PDFLayoutConfig["branding"],
    value: string
  ) => {
    onChange({
      ...config,
      branding: { ...config.branding, [key]: value },
    });
  };

  return (
    <div className="w-[320px] shrink-0 border-r border-border bg-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm">Layout Designer</h2>
          <p className="text-[11px] text-muted-foreground">
            Customize your PDF export
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => onChange(DEFAULT_PDF_LAYOUT)}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* ── Themes ── */}
          <section>
            <SectionHeading icon={Palette} label="Theme" />
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PDF_THEMES) as PDFThemeId[]).map((id) => (
                <ThemeCard
                  key={id}
                  themeId={id}
                  selected={config.themeId === id}
                  onClick={() => update("themeId", id)}
                />
              ))}
            </div>
          </section>

          <Separator />

          {/* ── Accent Color ── */}
          <section>
            <SectionHeading icon={Palette} label="Accent Color" />
            <p className="text-[11px] text-muted-foreground mb-2">
              Override the header color. Leave empty to use the theme default.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    update("accentColor", config.accentColor === c ? "" : c)
                  }
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    config.accentColor === c
                      ? "border-foreground scale-110"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="#hex"
                value={config.accentColor}
                onChange={(e) => update("accentColor", e.target.value)}
                className="h-8 text-xs font-mono flex-1"
                maxLength={7}
              />
              {config.accentColor && (
                <div
                  className="w-8 h-8 rounded border border-border shrink-0"
                  style={{ background: config.accentColor }}
                />
              )}
            </div>
          </section>

          <Separator />

          {/* ── Branding ── */}
          <section>
            <SectionHeading icon={Type} label="Branding" />
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1">Coach / Business Name</Label>
                <Input
                  value={config.branding.coachName}
                  onChange={(e) => updateBranding("coachName", e.target.value)}
                  placeholder="e.g. Iron Mind Coaching"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs mb-1">Tagline</Label>
                <Input
                  value={config.branding.tagline}
                  onChange={(e) => updateBranding("tagline", e.target.value)}
                  placeholder="e.g. Strength. Simplified."
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs mb-1">Logo URL</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={config.branding.logoUrl}
                    onChange={(e) => updateBranding("logoUrl", e.target.value)}
                    placeholder="https://… or data:image/…"
                    className="h-8 text-xs flex-1"
                  />
                  {config.branding.logoUrl && (
                    <img
                      src={config.branding.logoUrl}
                      alt=""
                      className="h-8 w-8 rounded border border-border object-contain bg-white"
                    />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Paste a logo image URL. Shows in the cover header.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Prepared For ── */}
          <section>
            <SectionHeading icon={User} label="Prepared For" />
            <Input
              value={config.preparedFor}
              onChange={(e) => update("preparedFor", e.target.value)}
              placeholder="e.g. John Smith"
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Client name printed on the cover page.
            </p>
          </section>

          <Separator />

          {/* ── Font Size ── */}
          <section>
            <SectionHeading icon={Type} label="Font Size" />
            <div className="flex gap-1.5">
              {(["small", "medium", "large"] as PDFFontSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update("fontSize", size)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                    config.fontSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* ── Font Family ── */}
          <section>
            <SectionHeading icon={Type} label="Font" />
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "Inter",
                "Roboto",
                "Oswald",
                "Lora",
                "Montserrat",
                "Playfair Display",
                "Raleway",
                "Source Sans 3",
              ].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => update("fontFamily", font)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium transition-all text-left truncate",
                    config.fontFamily === font
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {font}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* ── Table Density ── */}
          <section>
            <SectionHeading icon={Rows3} label="Density" />
            <div className="flex gap-1.5">
              {(["compact", "normal", "spacious"] as PDFTableDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update("tableDensity", d)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                    config.tableDensity === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* ── Custom Footer ── */}
          <section>
            <SectionHeading icon={FileText} label="Footer" />
            <Input
              value={config.footerText}
              onChange={(e) => update("footerText", e.target.value)}
              placeholder="e.g. © 2026 Iron Mind Coaching"
              className="h-8 text-xs"
            />
          </section>

          <Separator />

          {/* ── Page Breaks ── */}
          <section>
            <SectionHeading icon={Scissors} label="Page Breaks" />
            <div className="flex flex-col gap-1.5">
              {(
                [
                  { value: "none", label: "None" },
                  { value: "between-days", label: "Between days" },
                  { value: "between-blocks", label: "Between blocks" },
                ] as { value: PDFPageBreak; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("pageBreaks", value)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium text-left transition-all",
                    config.pageBreaks === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* ── Visibility toggles ── */}
          <section>
            <SectionHeading
              icon={config.showDescription ? Eye : EyeOff}
              label="Sections"
            />
            <div className="space-y-3">
              {(
                [
                  { key: "showCoverPage", label: "Cover header" },
                  { key: "showDescription", label: "Program description" },
                  { key: "showPageNumbers", label: "Page numbers" },
                  { key: "showSetType", label: "Set type column" },
                  { key: "showRest", label: "Rest column" },
                  { key: "showIntensity", label: "Intensity column" },
                  { key: "showNotes", label: "Notes column" },
                  { key: "showWarmupSets", label: "Warm-up sets" },
                ] as const
              ).map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <Label className="text-xs cursor-pointer" htmlFor={key}>
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={config[key]}
                    onCheckedChange={(v) => update(key, v)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
