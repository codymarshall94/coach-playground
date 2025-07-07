"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsernameSlugInput } from "@/components/UserNameSlugInput";
import { setUserProfile } from "@/services/authService";
import { toast } from "sonner";
import { useState } from "react";

export function ProfileDetailsForm({
  userId,
  onComplete,
  onCancel,
}: {
  userId: string;
  onComplete: () => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await setUserProfile({ userId, name, username });
    setLoading(false);
    if (result.success) onComplete();
    else toast.error(result.error);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Tell us a bit about you
      </h2>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Set up your profile so others can find you and discover your{" "}
        <span className="font-bold">Public Plans</span> on the platform.
      </p>

      {/* Why we need this info */}

      <div className="space-y-6">
        <div>
          <Label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Full name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        <div>
          <UsernameSlugInput
            initialValue={username}
            onChange={(value) => setUsername(value)}
          />
          <p className="text-xs mt-2 text-gray-500 leading-relaxed">
            This is your public username that others will use to find you. Must
            be unique and can't be changed later.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            Back
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !username.trim()}
        >
          {loading ? "Saving..." : "Finish Setup"}
        </Button>
      </div>
    </div>
  );
}
