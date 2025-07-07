"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/services/authService";
import { useState } from "react";
import { toast } from "sonner";

export function AuthForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: (userId: string, name?: string) => void;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    const result = await signUpUser({ email, password });
    setLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user.id);
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  return (
    <div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Let’s save this plan 💪
        </h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Create an account so you can come back to this anytime — and start
          building more.
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password">Create a password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="make it secret 🤫"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-sm text-gray-500 mt-1"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button
            className="w-full"
            onClick={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Next →"}
          </Button>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
