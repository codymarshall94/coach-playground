"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  EQUIPMENT_DISPLAY_MAP,
  EQUIPMENT_LIST,
} from "@/constants/equipment-list";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { MUSCLES } from "@/constants/muscles";
import { cn } from "@/lib/utils";
import { Equipment } from "@/types/Exercise";
import { groupBy } from "@/utils/groupBy";
import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

const traitTags = ["compound", "unilateral", "ballistic"] as const;

type Props = {
  categories: string[];
  activeCategories: string[];
  toggleCategory: (cat: string) => void;

  selectedMuscles: string[];
  toggleMuscle: (idOrGroup: string) => void;

  selectedTraits: string[];
  toggleTrait: (tag: string) => void;

  skill: string;
  setSkill: (val: string) => void;

  selectedEquipment: string[];
  toggleEquipment: (val: string) => void;

  clearFilters: () => void;

  maxFatigue: number | null;
  setMaxFatigue: (val: number | null) => void;
  maxCNS: number | null;
  setMaxCNS: (val: number | null) => void;
  maxMetabolic: number | null;
  setMaxMetabolic: (val: number | null) => void;
  maxJointStress: number | null;
  setMaxJointStress: (val: number | null) => void;
};

export function FilterPopover(props: Props) {
  const {
    categories,
    activeCategories,
    toggleCategory,

    selectedMuscles,
    toggleMuscle,

    selectedTraits,
    toggleTrait,

    skill,
    setSkill,

    selectedEquipment,
    toggleEquipment,

    clearFilters,

    maxFatigue,
    setMaxFatigue,
    maxCNS,
    setMaxCNS,
    maxMetabolic,
    setMaxMetabolic,
    maxJointStress,
    setMaxJointStress,
  } = props;

  const [showAdvancedMuscles, setShowAdvancedMuscles] = useState(false);

  // Data helpers
  const muscleGroups = useMemo(
    () => groupBy(MUSCLES, (m) => m.group || "ungrouped"),
    []
  );
  const groupNames = useMemo(() => Object.keys(muscleGroups), [muscleGroups]);

  const muscleNameById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.displayName])),
    []
  );

  // Count “active” filters per section
  const limitsSetCount = useMemo(() => {
    const vals = [maxFatigue, maxCNS, maxMetabolic, maxJointStress];
    return vals.filter((v) => v !== null && v < 1).length;
  }, [maxFatigue, maxCNS, maxMetabolic, maxJointStress]);

  const counts = useMemo(
    () => ({
      categories: activeCategories.length,
      muscles: selectedMuscles.length,
      traits: selectedTraits.length,
      equipment: selectedEquipment.length,
      skill: skill ? 1 : 0,
      limits: limitsSetCount,
    }),
    [
      activeCategories.length,
      selectedMuscles.length,
      selectedTraits.length,
      selectedEquipment.length,
      skill,
      limitsSetCount,
    ]
  );

  const totalActive = useMemo(
    () =>
      Object.values(counts).reduce(
        (acc, n) => acc + (typeof n === "number" ? (n > 0 ? 1 : 0) : 0),
        0
      ),
    [counts]
  );

  // Clear helpers (don’t require new setters in your hook)
  const clearCategories = () => {
    activeCategories.forEach((c) => toggleCategory(c));
  };
  const clearMuscles = () => {
    selectedMuscles.forEach((id) => toggleMuscle(id));
  };
  const clearTraits = () => {
    selectedTraits.forEach((t) => toggleTrait(t));
  };
  const clearEquipment = () => {
    selectedEquipment.forEach((e) => toggleEquipment(e));
  };
  const clearSkill = () => setSkill("");
  const clearLimits = () => {
    setMaxFatigue(null);
    setMaxCNS(null);
    setMaxMetabolic(null);
    setMaxJointStress(null);
  };

  // Build chip list (for the chip bar inside the popover)
  type Chip = { key: string; label: string; onRemove: () => void };
  const chips: Chip[] = useMemo(() => {
    const list: Chip[] = [];

    // Categories
    if (activeCategories.length) {
      list.push({
        key: "categories",
        label: activeCategories
          .map((c) => CATEGORY_DISPLAY_MAP[c] ?? c)
          .join(", "),
        onRemove: clearCategories,
      });
    }

    // Muscles
    if (selectedMuscles.length) {
      list.push({
        key: "muscles",
        label: selectedMuscles.map((id) => muscleNameById[id] ?? id).join(", "),
        onRemove: clearMuscles,
      });
    }

    // Traits
    if (selectedTraits.length) {
      list.push({
        key: "traits",
        label: selectedTraits.join(", "),
        onRemove: clearTraits,
      });
    }

    // Equipment
    if (selectedEquipment.length) {
      list.push({
        key: "equipment",
        label: selectedEquipment
          .map((e) => EQUIPMENT_DISPLAY_MAP[e as Equipment] ?? e)
          .join(", "),
        onRemove: clearEquipment,
      });
    }

    // Skill
    if (skill) {
      const label =
        skill === "low"
          ? "Beginner"
          : skill === "moderate"
          ? "Intermediate"
          : "Advanced";
      list.push({ key: "skill", label, onRemove: clearSkill });
    }

    // Limits (combine)
    if (limitsSetCount > 0) {
      const parts: string[] = [];
      if (maxFatigue !== null && maxFatigue < 1)
        parts.push(`Fatigue ≤ ${maxFatigue.toFixed(1)}`);
      if (maxCNS !== null && maxCNS < 1)
        parts.push(`CNS ≤ ${maxCNS.toFixed(1)}`);
      if (maxMetabolic !== null && maxMetabolic < 1)
        parts.push(`Metabolic ≤ ${maxMetabolic.toFixed(1)}`);
      if (maxJointStress !== null && maxJointStress < 1)
        parts.push(`Joint ≤ ${maxJointStress.toFixed(1)}`);

      list.push({
        key: "limits",
        label: parts.join(" · "),
        onRemove: clearLimits,
      });
    }

    return list;
  }, [
    activeCategories,
    selectedMuscles,
    selectedTraits,
    selectedEquipment,
    skill,
    maxFatigue,
    maxCNS,
    maxMetabolic,
    maxJointStress,
    limitsSetCount,
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="w-4 h-4" />
          {totalActive > 0 && (
            <span
              className="
                absolute -top-1 -right-1 inline-flex items-center justify-center
                h-5 min-w-5 px-1 rounded-full text-[10px] font-medium
                bg-primary text-primary-foreground
                "
              aria-label={`${totalActive} sections filtered`}
            >
              {totalActive}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[90vw] sm:w-[640px] max-w-[680px] max-h-[80vh] overflow-y-auto p-4">
        {/* Chip bar */}
        {chips.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-xs",
                  "bg-secondary text-secondary-foreground",
                  "border border-border/60 hover:bg-secondary/80 transition"
                )}
                aria-label={`Remove ${chip.key} filter`}
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7"
            >
              Clear all
            </Button>
          </div>
        )}

        <Accordion type="multiple" defaultValue={["categories", "muscles"]}>
          {/* CATEGORIES */}
          <Section
            id="categories"
            title="Categories"
            count={counts.categories}
            onClear={counts.categories ? clearCategories : undefined}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => {
                const active = activeCategories.includes(cat);
                return (
                  <ChipBadge
                    key={cat}
                    active={active}
                    onClick={() => toggleCategory(cat)}
                  >
                    {CATEGORY_DISPLAY_MAP[cat] ?? cat}
                  </ChipBadge>
                );
              })}
            </div>
          </Section>

          {/* MUSCLES */}
          <Section
            id="muscles"
            title="Muscles"
            count={counts.muscles}
            onClear={counts.muscles ? clearMuscles : undefined}
          >
            {!showAdvancedMuscles ? (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {groupNames.map((group) => {
                  const allSelected = muscleGroups[group].every((m) =>
                    selectedMuscles.includes(m.id)
                  );
                  return (
                    <ChipBadge
                      key={group}
                      active={allSelected}
                      onClick={() => toggleMuscle(group)}
                      className="capitalize"
                    >
                      {group.replace("_", " ")}
                    </ChipBadge>
                  );
                })}
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowAdvancedMuscles(true)}
                >
                  Advanced ▼
                </Button>
              </div>
            ) : (
              <>
                {groupNames.map((group) => {
                  const ids = muscleGroups[group].map((m) => m.id);
                  const noneSelected = ids.every(
                    (id) => !selectedMuscles.includes(id)
                  );
                  const allSelected = ids.every((id) =>
                    selectedMuscles.includes(id)
                  );

                  const selectGroup = () => {
                    // ensure all are selected
                    ids.forEach((id) => {
                      if (!selectedMuscles.includes(id)) toggleMuscle(id);
                    });
                  };
                  const clearGroup = () => {
                    ids.forEach((id) => {
                      if (selectedMuscles.includes(id)) toggleMuscle(id);
                    });
                  };

                  return (
                    <div key={group} className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium text-muted-foreground capitalize">
                          {group.replace("_", " ")}
                        </p>
                        <div className="ml-auto flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px]"
                            onClick={selectGroup}
                            disabled={allSelected}
                          >
                            Select all
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px]"
                            onClick={clearGroup}
                            disabled={noneSelected}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {muscleGroups[group].map((m) => {
                          const active = selectedMuscles.includes(m.id);
                          return (
                            <ChipBadge
                              key={m.id}
                              active={active}
                              onClick={() => toggleMuscle(m.id)}
                            >
                              {m.displayName}
                            </ChipBadge>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs mt-2"
                  onClick={() => setShowAdvancedMuscles(false)}
                >
                  ← Back to Groups
                </Button>
              </>
            )}
          </Section>

          {/* TRAITS */}
          <Section
            id="traits"
            title="Exercise Traits"
            count={counts.traits}
            onClear={counts.traits ? clearTraits : undefined}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {traitTags.map((tag) => {
                const active = selectedTraits.includes(tag);
                return (
                  <ChipBadge
                    key={tag}
                    active={active}
                    onClick={() => toggleTrait(tag)}
                    className="capitalize"
                  >
                    {tag}
                  </ChipBadge>
                );
              })}
            </div>
          </Section>

          {/* LIMITS */}
          <Section
            id="limits"
            title="Fatigue Limits"
            count={counts.limits}
            onClear={counts.limits ? clearLimits : undefined}
          >
            <LimitRow
              label={`Fatigue Index ≤ ${maxFatigue ?? "Any"}`}
              value={maxFatigue}
              onChange={setMaxFatigue}
            />
            <p className="text-xs text-muted-foreground mb-4">
              Overall per-set fatigue. 0 = light, 1 = very taxing.
            </p>

            <LimitRow
              label={`CNS Demand ≤ ${maxCNS ?? "Any"}`}
              value={maxCNS}
              onChange={setMaxCNS}
            />
            <p className="text-xs text-muted-foreground mb-4">
              Neurological load. High values (≥ 0.8) involve explosive or heavy
              lifts.
            </p>

            <LimitRow
              label={`Metabolic Demand ≤ ${maxMetabolic ?? "Any"}`}
              value={maxMetabolic}
              onChange={setMaxMetabolic}
            />
            <p className="text-xs text-muted-foreground mb-4">
              “Burn” factor. High values stress endurance and recovery.
            </p>

            <LimitRow
              label={`Joint Stress ≤ ${maxJointStress ?? "Any"}`}
              value={maxJointStress}
              onChange={setMaxJointStress}
            />
            <p className="text-xs text-muted-foreground">
              Keep low (&lt; 0.4) for rehab or accessory work.
            </p>
          </Section>

          {/* SKILL */}
          <Section
            id="difficulty"
            title="Skill Level"
            count={counts.skill}
            onClear={counts.skill ? clearSkill : undefined}
          >
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Beginner</SelectItem>
                <SelectItem value="moderate">Intermediate</SelectItem>
                <SelectItem value="high">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          {/* EQUIPMENT */}
          <Section
            id="equipment"
            title="Equipment"
            count={counts.equipment}
            onClear={counts.equipment ? clearEquipment : undefined}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {EQUIPMENT_LIST.map((eq) => {
                const active = selectedEquipment.includes(eq);
                return (
                  <ChipBadge
                    key={eq}
                    active={active}
                    onClick={() => toggleEquipment(eq)}
                    className="capitalize"
                  >
                    {EQUIPMENT_DISPLAY_MAP[eq]}
                  </ChipBadge>
                );
              })}
            </div>
          </Section>
        </Accordion>

        <div className="flex gap-2 mt-4">
          <Button onClick={clearFilters} variant="secondary" className="w-full">
            Clear All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** --- Small building blocks to keep things tidy --- */

function Section({
  id,
  title,
  count,
  onClear,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="relative">
        <div className="flex items-center gap-2">
          {title}
          {!!count && (
            <span
              className="
                inline-flex h-5 min-w-5 items-center justify-center rounded-full
                text-[10px] px-1 bg-muted text-foreground"
              aria-label={`${count} selected in ${title}`}
            >
              {count}
            </span>
          )}
        </div>
        {onClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-10 top-1/2 -translate-y-1/2 h-6 text-[11px]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
          >
            Clear
          </Button>
        )}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

function ChipBadge({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-xs transition",
        active
          ? "bg-primary text-primary-foreground border-transparent"
          : "bg-background text-foreground border-border hover:bg-muted",
        className
      )}
    >
      {children}
    </button>
  );
}

function LimitRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const v = value ?? 1;
  const isAny = value === null || value >= 1;
  return (
    <div className="space-y-1 mt-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm">{label}</Label>
        {!isAny && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] ml-auto"
            onClick={() => onChange(null)}
          >
            Any
          </Button>
        )}
      </div>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={[v]}
        onValueChange={([val]) => onChange(val >= 1 ? null : val)}
      />
    </div>
  );
}
