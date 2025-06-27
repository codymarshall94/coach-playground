"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import { groupBy } from "@/utils/groupBy";
import { Filter } from "lucide-react";
import { useState } from "react";

const traitTags = ["compound", "unilateral", "ballistic"];

export function FilterPopover({
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
}: {
  categories: string[];
  activeCategories: string[];
  toggleCategory: (cat: string) => void;
  selectedMuscles: string[];
  toggleMuscle: (id: string) => void;
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
}) {
  const [showAdvancedMuscles, setShowAdvancedMuscles] = useState(false);
  const muscleGroups = groupBy(MUSCLES, (m) => m.group || "ungrouped");
  const groupNames = Object.keys(muscleGroups);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2">
          <Filter className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4">
        <Accordion type="single" defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={
                      activeCategories.includes(cat) ? "default" : "outline"
                    }
                    onClick={() => toggleCategory(cat)}
                    className="cursor-pointer"
                  >
                    {CATEGORY_DISPLAY_MAP[cat]}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="muscles">
            <AccordionTrigger>Muscles</AccordionTrigger>
            <AccordionContent>
              {!showAdvancedMuscles ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {groupNames.map((group) => (
                    <Badge
                      key={group}
                      variant={
                        muscleGroups[group].every((m) =>
                          selectedMuscles.includes(m.id)
                        )
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleMuscle(group)}
                      className="cursor-pointer capitalize"
                    >
                      {group.replace("_", " ")}
                    </Badge>
                  ))}
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
                  {groupNames.map((group) => (
                    <div key={group} className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                        {group.replace("_", " ")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {muscleGroups[group].map((m) => (
                          <Badge
                            key={m.id}
                            variant={
                              selectedMuscles.includes(m.id)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleMuscle(m.id)}
                            className="cursor-pointer"
                          >
                            {m.displayName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="traits">
            <AccordionTrigger>Exercise Traits</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {traitTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      selectedTraits.includes(tag) ? "default" : "outline"
                    }
                    onClick={() => toggleTrait(tag)}
                    className="cursor-pointer capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limits">
            <AccordionTrigger>Fatigue Limits</AccordionTrigger>
            <AccordionContent className="space-y-6">
              <div className="space-y-1">
                <Label>Fatigue Index ≤ {maxFatigue ?? 1}</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[maxFatigue ?? 1]}
                  onValueChange={([val]) => setMaxFatigue(val)}
                />
                <p className="text-xs text-muted-foreground">
                  Overall per-set fatigue. 0 = light, 1 = very taxing.
                </p>
              </div>

              <div className="space-y-1">
                <Label>CNS Demand ≤ {maxCNS ?? 1}</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[maxCNS ?? 1]}
                  onValueChange={([val]) => setMaxCNS(val)}
                />
                <p className="text-xs text-muted-foreground">
                  Neurological load. High values (≥ 0.8) involve explosive or
                  heavy lifts.
                </p>
              </div>

              <div className="space-y-1">
                <Label>Metabolic Demand ≤ {maxMetabolic ?? 1}</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[maxMetabolic ?? 1]}
                  onValueChange={([val]) => setMaxMetabolic(val)}
                />
                <p className="text-xs text-muted-foreground">
                  "Burn" factor. High values stress endurance and recovery.
                </p>
              </div>

              <div className="space-y-1">
                <Label>Joint Stress ≤ {maxJointStress ?? 1}</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[maxJointStress ?? 1]}
                  onValueChange={([val]) => setMaxJointStress(val)}
                />
                <p className="text-xs text-muted-foreground">
                  Estimated strain on joints. Keep low (&lt; 0.4) for rehab or
                  accessory work.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="difficulty">
            <AccordionTrigger>Skill Level</AccordionTrigger>
            <AccordionContent>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Beginner</SelectItem>
                  <SelectItem value="moderate">Intermediate</SelectItem>
                  <SelectItem value="high">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="equipment">
            <AccordionTrigger>Equipment</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {EQUIPMENT_LIST.map((eq) => (
                  <Badge
                    key={eq}
                    variant={
                      selectedEquipment.includes(eq) ? "default" : "outline"
                    }
                    onClick={() => toggleEquipment(eq)}
                    className="cursor-pointer capitalize"
                  >
                    {EQUIPMENT_DISPLAY_MAP[eq]}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-2 mt-4">
          <Button onClick={clearFilters} variant="secondary" className="w-full">
            Clear Filters
          </Button>
          {/* Optional future preset feature */}
          {/* <Button variant="outline">Save Preset</Button> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
