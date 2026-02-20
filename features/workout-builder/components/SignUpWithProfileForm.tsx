"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { setUserProfile, signUpUser } from "@/services/authService";
import { generateAvailableUsername, slugify } from "@/utils/slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Schema                                                                    */
/* -------------------------------------------------------------------------- */

const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

/* -------------------------------------------------------------------------- */
/*  Password strength helper                                                  */
/* -------------------------------------------------------------------------- */

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-brand" };
}

/* -------------------------------------------------------------------------- */
/*  Inline error component                                                    */
/* -------------------------------------------------------------------------- */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="flex items-center gap-1 text-xs text-destructive mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function SignUpWithProfileForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: (userId: string) => void;
  onCancel: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Username slug derived from fullName
  const [usernameSlug, setUsernameSlug] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const fullName = watch("fullName");
  const password = watch("password");
  const strength = getPasswordStrength(password ?? "");

  // Debounced username availability check
  const checkUsername = useCallback(async (name: string) => {
    setUsernameChecking(true);
    const availableSlug = await generateAvailableUsername(name);
    if (availableSlug) {
      setUsernameSlug(availableSlug);
      setUsernameAvailable(true);
    } else {
      setUsernameSlug(slugify(name));
      setUsernameAvailable(false);
    }
    setUsernameChecking(false);
  }, []);

  useEffect(() => {
    if (!fullName || fullName.trim().length < 2) {
      setUsernameSlug("");
      return;
    }
    const timeout = setTimeout(() => checkUsername(fullName), 400);
    return () => clearTimeout(timeout);
  }, [fullName, checkUsername]);

  const onSubmit = async (values: SignUpValues) => {
    if (!usernameAvailable) {
      toast.error("This name is too popular \u2014 try a variation.");
      return;
    }

    setServerError(null);
    setSubmitting(true);

    const signup = await signUpUser({
      email: values.email,
      password: values.password,
    });

    if (!signup.success || !signup.user) {
      setServerError(signup.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    const profile = await setUserProfile({
      userId: signup.user.id,
      fullName: values.fullName,
      username: usernameSlug,
    });

    if (!profile.success) {
      setServerError(profile.error ?? "Failed to save profile.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess(signup.user.id);
  };

  return (
    <div>
      {/* Mobile-only heading (hidden when left brand panel shows) */}
      <div className="md:hidden mb-6">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-foreground">
          Save your program
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to keep this and start building more.
        </p>
      </div>

      {/* Desktop heading (when brand panel is visible) */}
      <div className="hidden md:block mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Takes about 30 seconds.
        </p>
      </div>

      {/* Server-level error banner */}
      {serverError && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Your full name</Label>
          <Input
            id="name"
            placeholder="Jane Trainer"
            autoFocus
            aria-invalid={!!errors.fullName}
            className={cn(
              errors.fullName &&
                "border-destructive focus-visible:ring-destructive/40",
            )}
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Your email</Label>
          <Input
            id="email"
            placeholder="you@domain.com"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive/40",
            )}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Create a password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Min. 8 characters"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className={cn(
                "pr-10",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive/40",
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />

          {/* Password strength meter */}
          {password && !errors.password && (
            <div className="space-y-1 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strength.score ? strength.color : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength:{" "}
                <span className="font-medium text-foreground">
                  {strength.label}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Username preview */}
        {usernameSlug && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Your profile will be:</span>
            <span className="font-medium text-foreground">
              /u/{usernameSlug}
            </span>
            {usernameChecking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : usernameAvailable ? (
              <CheckCircle className="w-3.5 h-3.5 text-brand" />
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-destructive">
                  Unavailable &mdash; try a variation
                </span>
              </>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="pt-2 space-y-2">
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={submitting || !isValid || !usernameAvailable}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <button
            type="button"
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}