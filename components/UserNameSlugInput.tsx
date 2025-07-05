"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { slugify } from "@/utils/slugify";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function UsernameSlugInput({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [rawInput, setRawInput] = useState(initialValue);
  const [slug, setSlug] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const s = slugify(rawInput);
    setSlug(s);
    if (s.length < 3) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", s);

      if (error) {
        console.error(error);
        setIsAvailable(null);
        setIsChecking(false);
        return;
      }

      setIsAvailable(data.length === 0);
      setIsChecking(false);
      onChange?.(s);
    };

    const delay = setTimeout(checkAvailability, 500); // debounce
    return () => clearTimeout(delay);
  }, [rawInput]);

  return (
    <div className="space-y-1">
      <Label htmlFor="username" className="text-sm font-medium">
        Username
      </Label>
      <div className="relative">
        <Input
          id="username"
          name="username"
          placeholder="your-name"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className={cn(
            isAvailable === true && "ring-1 ring-green-400",
            isAvailable === false && "ring-1 ring-red-400"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {isAvailable === true && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {isAvailable === false && (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      {slug && (
        <p className="text-xs text-muted-foreground">
          Your profile URL will be:{" "}
          <span className="text-blue-600">/u/{slug}</span>
        </p>
      )}
    </div>
  );
}
