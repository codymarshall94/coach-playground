"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DayDescriptionEditorProps {
  value: string;
  onSave: (val: string) => void;
}

export const DayDescriptionEditor: React.FC<DayDescriptionEditorProps> = ({
  value,
  onSave,
}) => {
  const [temp, setTemp] = useState(value);

  return (
    <div className="space-y-2">
      <Textarea
        rows={3}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        placeholder="E.g. Focus on glutes, light accessories..."
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={() => onSave(temp)}>
          Save
        </Button>
      </div>
    </div>
  );
};
