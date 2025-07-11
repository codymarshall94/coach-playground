"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Edit3, Check, AlertCircle } from "lucide-react";
import { useId, useState, useRef, useEffect } from "react";

interface SmartInputProps {
  label?: string;
  value: number | string;
  options: number[];
  placeholder?: string;
  onChange: (val: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  allowClear?: boolean;
  defaultValue?: number;
}

export function SmartInput({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  min,
  max,
  step = 1,
  allowClear = true,
  defaultValue,
}: SmartInputProps) {
  const [mode, setMode] = useState<"select" | "custom">("select");
  const [inputValue, setInputValue] = useState(String(value));
  const [isValid, setIsValid] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const parsedValue = Number(value);
  const isEmpty = value === "" || isNaN(parsedValue);
  const isCustomValue = !isEmpty && !options.includes(parsedValue);

  // Auto-focus input when switching to custom mode
  useEffect(() => {
    if (mode === "custom" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [mode]);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const validateInput = (val: string) => {
    const num = Number(val);
    if (val === "" || isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const isValidInput = validateInput(val);
    setIsValid(isValidInput);

    if (isValidInput) {
      const numVal = Number(val);
      const clamped = Math.max(
        min ?? Number.NEGATIVE_INFINITY,
        Math.min(max ?? Number.POSITIVE_INFINITY, numVal)
      );
      onChange(clamped);
    }
  };

  const handleModeSwitch = (newMode: "select" | "custom") => {
    setShowTransition(true);
    setTimeout(() => {
      setMode(newMode);
      setShowTransition(false);
    }, 150);
  };

  const handleReset = () => {
    const resetValue = defaultValue ?? options[0] ?? 0;
    onChange(resetValue);
    setMode("select");
    setIsValid(true);
  };

  const handleSelectChange = (v: string) => {
    if (v === "custom") {
      handleModeSwitch("custom");
    } else {
      onChange(Number(v));
      setIsValid(true);
    }
  };

  const handleInputBlur = () => {
    if (isEmpty || !isValid) {
      handleReset();
    } else if (options.includes(parsedValue)) {
      setMode("select");
    }
  };

  const getValidationMessage = () => {
    if (min !== undefined && max !== undefined) {
      return `Value must be between ${min} and ${max}`;
    } else if (min !== undefined) {
      return `Value must be at least ${min}`;
    } else if (max !== undefined) {
      return `Value must be at most ${max}`;
    }
    return "";
  };

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-muted-foreground block"
        >
          {label}
        </label>
      )}

      <div
        className={`relative transition-all duration-200 ${
          showTransition ? "opacity-50 scale-[0.98]" : "opacity-100 scale-100"
        }`}
      >
        {mode === "select" && !disabled ? (
          <div className="relative">
            <Select
              onValueChange={handleSelectChange}
              value={isCustomValue ? "custom" : String(value)}
              disabled={disabled}
            >
              <SelectTrigger className="h-9 text-center font-medium w-full">
                <SelectValue placeholder={placeholder || "Select value"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
                <SelectItem value="custom" className="text-blue-600">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    Custom value...
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {isCustomValue && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 border-blue-200"
              >
                Custom
              </Badge>
            )}
          </div>
        ) : (
          <div className="relative">
            <Input
              ref={inputRef}
              id={inputId}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputRef.current?.blur();
                } else if (e.key === "Escape") {
                  handleReset();
                }
              }}
              className={`h-9 text-center font-medium pr-16 transition-colors ${
                !isValid
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : ""
              }`}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              placeholder={`Enter value${
                min !== undefined || max !== undefined
                  ? ` (${min ?? ""}${
                      min !== undefined && max !== undefined ? "-" : ""
                    }${max ?? ""})`
                  : ""
              }`}
            />

            <div className="absolute top-1 right-1 flex gap-1">
              {!isValid && (
                <div
                  className="flex items-center justify-center h-7 w-7 text-red-500"
                  title={getValidationMessage()}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}

              {isValid && !isEmpty && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMode("select")}
                  className="h-7 w-7 text-green-600 hover:bg-green-50"
                  title="Confirm value"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}

              {allowClear && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-7 w-7 text-muted-foreground hover:bg-muted"
                  title="Reset to default"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isValid && mode === "custom" && (
        <p className="text-xs text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-3 h-3" />
          {getValidationMessage()}
        </p>
      )}

      {mode === "custom" && isValid && (
        <p className="text-xs text-muted-foreground">
          Press Enter to confirm, Escape to cancel
        </p>
      )}
    </div>
  );
}
