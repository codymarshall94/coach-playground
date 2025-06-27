"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { useState } from "react";

export function SettingsPopover() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [defaultRest, setDefaultRest] = useState<60 | 90>(90);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-4 space-y-4">
        <h4 className="text-sm font-medium">Workout Settings</h4>
        <Separator />

        {/* Unit Toggle */}
        <div className="flex items-center justify-between">
          <Label>Unit</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={unit === "kg" ? "default" : "outline"}
              onClick={() => setUnit("kg")}
            >
              kg
            </Button>
            <Button
              size="sm"
              variant={unit === "lbs" ? "default" : "outline"}
              onClick={() => setUnit("lbs")}
            >
              lbs
            </Button>
          </div>
        </div>

        {/* Rest Time Default */}
        <div className="flex items-center justify-between">
          <Label>Default Rest</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={defaultRest === 60 ? "default" : "outline"}
              onClick={() => setDefaultRest(60)}
            >
              60s
            </Button>
            <Button
              size="sm"
              variant={defaultRest === 90 ? "default" : "outline"}
              onClick={() => setDefaultRest(90)}
            >
              90s
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
