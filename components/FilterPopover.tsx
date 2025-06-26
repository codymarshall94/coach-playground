"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { MUSCLES } from "@/constants/muscles";
import { Filter } from "lucide-react";

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
  equipment,
  setEquipment,
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
  equipment: string;
  setEquipment: (val: string) => void;
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
              <div className="flex flex-wrap gap-2 mt-2">
                {MUSCLES.map((m) => (
                  <Badge
                    key={m.id}
                    variant={
                      selectedMuscles.includes(m.id) ? "default" : "outline"
                    }
                    onClick={() => toggleMuscle(m.id)}
                    className="cursor-pointer"
                  >
                    {m.displayName}
                  </Badge>
                ))}
              </div>
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
            <AccordionContent className="space-y-4">
              <h4 className="text-sm font-medium text-slate-700">
                Set limits for fatigue metrics
              </h4>
              <p className="text-xs text-slate-500">
                Filter out exercises that exceed your desired threshold for
                fatigue, joint stress, CNS, or metabolic load. All values are
                between 0 (low) and 1 (high).
              </p>

              <div>
                <Label>Fatigue Index ≤</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={maxFatigue ?? ""}
                  onChange={(e) =>
                    setMaxFatigue(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Overall per-set fatigue. 0 = light, 1 = very taxing.
                </p>
              </div>

              <div>
                <Label>CNS Demand ≤</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={maxCNS ?? ""}
                  onChange={(e) =>
                    setMaxCNS(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Neurological load. High values (&gt; 0.8) involve explosive or
                  heavy lifts.
                </p>
              </div>

              <div>
                <Label>Metabolic Demand ≤</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={maxMetabolic ?? ""}
                  onChange={(e) =>
                    setMaxMetabolic(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  "Burn" factor. High values stress endurance and recovery.
                </p>
              </div>

              <div>
                <Label>Joint Stress ≤</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={maxJointStress ?? ""}
                  onChange={(e) =>
                    setMaxJointStress(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
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
              <Input
                placeholder="e.g. dumbbell"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
              />
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
