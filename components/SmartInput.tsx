"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";

interface SmartInputProps {
  label?: string;
  value: number | string;
  options: number[];
  placeholder?: string;
  onChange: (val: number) => void;
  disabled?: boolean;
  /** Render as a flat table cell — no border, no shadow, transparent bg */
  cellMode?: boolean;
  /* Kept for call-site compat — ignored */
  min?: number;
  max?: number;
  step?: number;
  allowClear?: boolean;
  defaultValue?: number;
  customLabel?: string;
  badgeLabel?: string;
}

export function SmartInput({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  cellMode = false,
}: SmartInputProps) {
  const inputId = useId();

  const handleSelectChange = (v: string) => {
    onChange(Number(v));
  };

  // If the current value isn't in options, snap to the closest one
  const parsedValue = Number(value);
  const displayValue =
    !isNaN(parsedValue) && options.includes(parsedValue)
      ? String(parsedValue)
      : String(options[0] ?? 0);

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-meta block">
          {label}
        </label>
      )}

      <Select
        onValueChange={handleSelectChange}
        value={displayValue}
        disabled={disabled}
      >
        <SelectTrigger
          className={`flex items-center justify-center tabular-nums w-full ${
            cellMode
              ? "h-6 text-xs border-0 shadow-none bg-transparent rounded-none focus:ring-0 focus:ring-offset-0 px-1"
              : "h-9"
          }`}
        >
          <SelectValue placeholder={placeholder || "Select value"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
