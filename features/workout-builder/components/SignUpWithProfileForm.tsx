"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserProfile, signUpUser } from "@/services/authService";
import { generateAvailableUsername, slugify } from "@/utils/slugify";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SignUpWithProfileForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: (userId: string) => void;
  onCancel: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usernameSlug, setUsernameSlug] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  useEffect(() => {
    const checkAndSet = async () => {
      const availableSlug = await generateAvailableUsername(fullName);
      if (availableSlug) {
        setUsernameSlug(availableSlug);
        setUsernameAvailable(true);
      } else {
        setUsernameSlug(slugify(fullName));
        setUsernameAvailable(false);
      }
    };

    const delay = setTimeout(checkAndSet, 400);
    return () => clearTimeout(delay);
  }, [fullName]);

  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    if (!usernameAvailable) {
      toast.error("This name is too popular 😅 Try a variation.");
      return;
    }

    setLoading(true);

    const signup = await signUpUser({ email, password });
    if (!signup.success || !signup.user) {
      toast.error(signup.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    const profile = await setUserProfile({
      userId: signup.user.id,
      fullName,
      username: usernameSlug,
    });

    if (!profile.success) {
      toast.error(profile.error ?? "Failed to save profile.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess(signup.user.id);
  };

  return (
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
          <Label htmlFor="name">Your full name</Label>
          <Input
            id="name"
            placeholder="Jane Trainer"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="email">Your email</Label>
          <Input
            id="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Create a password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="make it secret 🤫"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {usernameSlug && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Your profile will be:
            <span className="text-blue-600 font-medium">/u/{usernameSlug}</span>
            {usernameAvailable ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </p>
        )}

        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Finish Setup →"}
        </Button>

        <Button variant="ghost" className="w-full mt-2" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
