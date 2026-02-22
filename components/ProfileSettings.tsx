"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UsernameSlugInput } from "@/components/UserNameSlugInput";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import {
  updateProfileClient,
  uploadAvatar,
  uploadCoverImage,
  uploadLogo,
} from "@/services/profileClientService";
import type { AccountType } from "@/types/Profile";
import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  Globe,
  ImageIcon,
  Instagram,
  Loader2,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  full_name: string;
  account_type: AccountType;
  username: string;
  bio: string;
  brand_name: string;
  website: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  avatar_url: string;
  logo_url: string;
  cover_image_url: string;
}

const EMPTY: FormState = {
  full_name: "",
  account_type: "personal",
  username: "",
  bio: "",
  brand_name: "",
  website: "",
  social_instagram: "",
  social_twitter: "",
  social_youtube: "",
  avatar_url: "",
  logo_url: "",
  cover_image_url: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileSettings() {
  const { profile, loading, refreshProfile } = useUserProfile();
  const [state, setState] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const hasSynced = useRef(false);

  // Populate form once profile loads
  useEffect(() => {
    if (profile && !hasSynced.current) {
      hasSynced.current = true;
      setState({
        full_name: profile.full_name ?? "",
        account_type: (profile.account_type as AccountType) ?? "personal",
        username: profile.username ?? "",
        bio: profile.bio ?? "",
        brand_name: profile.brand_name ?? "",
        website: profile.website ?? "",
        social_instagram: profile.social_instagram ?? "",
        social_twitter: profile.social_twitter ?? "",
        social_youtube: profile.social_youtube ?? "",
        avatar_url: profile.avatar_url ?? "",
        logo_url: profile.logo_url ?? "",
        cover_image_url: profile.cover_image_url ?? "",
      });
    }
  }, [profile]);

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setState((prev) => ({ ...prev, [key]: value })),
    [],
  );

  // -----------------------------------------------------------------------
  // Image upload
  // -----------------------------------------------------------------------

  const handleFileUpload = async (
    accept: string,
    uploadFn: (file: File) => Promise<string>,
    key: keyof FormState,
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5 MB");
        return;
      }
      setUploading(true);
      try {
        const url = await uploadFn(file);
        set(key, url as FormState[typeof key]);
        toast.success("Uploaded!");
      } catch (err) {
        toast.error("Upload failed");
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  // -----------------------------------------------------------------------
  // Save
  // -----------------------------------------------------------------------

  const canSave = state.full_name.trim().length >= 2 && state.username.length >= 3;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateProfileClient({
        full_name: state.full_name.trim(),
        account_type: state.account_type,
        username: state.username,
        bio: state.bio.trim() || null,
        brand_name: state.brand_name.trim() || null,
        website: state.website.trim() || null,
        social_instagram: state.social_instagram.trim() || null,
        social_twitter: state.social_twitter.trim() || null,
        social_youtube: state.social_youtube.trim() || null,
        avatar_url: state.avatar_url || null,
        logo_url: state.logo_url || null,
        cover_image_url: state.cover_image_url || null,
      });
      await refreshProfile();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Loading skeleton
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to programs
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your public profile information.
        </p>
      </div>

      <div className="space-y-8">
        {/* ── Section: Photos ── */}
        <section className="rounded-xl border bg-card p-6 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Photos
          </h2>

          {/* Cover Image */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cover Image</Label>
            {state.cover_image_url ? (
              <div className="relative rounded-xl overflow-hidden border ring-1 ring-border">
                <Image
                  src={state.cover_image_url}
                  alt="Cover"
                  width={600}
                  height={160}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={uploading}
                  className="absolute bottom-3 right-3 shadow-md"
                  onClick={() =>
                    handleFileUpload("image/*", uploadCoverImage, "cover_image_url")
                  }
                >
                  Change Cover
                </Button>
              </div>
            ) : (
              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  handleFileUpload("image/*", uploadCoverImage, "cover_image_url")
                }
                className="w-full h-40 rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/30 transition-all duration-200"
              >
                <ImageIcon className="w-7 h-7" />
                <span className="text-sm font-medium">Upload a cover image</span>
                <span className="text-[11px] text-muted-foreground/60">
                  Recommended: 1200 &times; 400px
                </span>
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Profile Photo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-border">
                <AvatarImage src={state.avatar_url} />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-muted to-muted-foreground/10">
                  {state.full_name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() =>
                  handleFileUpload("image/*", uploadAvatar, "avatar_url")
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                {state.avatar_url ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>

          {/* Logo (brand only) */}
          {state.account_type === "brand" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Brand Logo</Label>
              <div className="flex items-center gap-4">
                {state.logo_url ? (
                  <Image
                    src={state.logo_url}
                    alt="Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-xl object-contain border ring-2 ring-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() =>
                    handleFileUpload("image/*", uploadLogo, "logo_url")
                  }
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {state.logo_url ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ── Section: Basics ── */}
        <section className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Basic Info
          </h2>

          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="e.g. Alex Rivera"
              value={state.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className="h-11"
            />
            {state.full_name.trim().length > 0 && state.full_name.trim().length < 2 && (
              <p className="text-[11px] text-destructive">Name must be at least 2 characters.</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    type: "personal" as const,
                    icon: User,
                    title: "Personal",
                    desc: "Individual coach or athlete",
                  },
                  {
                    type: "brand" as const,
                    icon: Building2,
                    title: "Brand",
                    desc: "Business, gym, or team",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => set("account_type", opt.type)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 transition-all duration-200",
                    state.account_type === opt.type
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      state.account_type === opt.type
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10",
                    )}
                  >
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">{opt.title}</span>
                  <span className="text-[11px] text-muted-foreground text-center leading-tight">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {state.account_type === "brand" && (
            <div className="space-y-2">
              <Label htmlFor="brand_name" className="text-sm font-medium">
                Brand / Business Name
              </Label>
              <Input
                id="brand_name"
                placeholder="e.g. Iron Path Coaching"
                value={state.brand_name}
                onChange={(e) => set("brand_name", e.target.value)}
                className="h-11"
              />
            </div>
          )}
        </section>

        {/* ── Section: Username ── */}
        <section className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Username
          </h2>

          {state.username && (
            <div className="rounded-lg bg-muted/50 border p-3">
              <p className="text-xs text-muted-foreground">Your public URL</p>
              <p className="text-sm font-semibold mt-0.5">
                prgrm.app/u/{state.username}
              </p>
            </div>
          )}

          <UsernameSlugInput
            initialValue={state.username || state.full_name}
            currentUserId={profile?.id}
            onChange={(slug) => set("username", slug)}
          />
        </section>

        {/* ── Section: About ── */}
        <section className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </h2>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="What's your coaching philosophy? What makes you different?"
              value={state.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={3}
              maxLength={300}
            />
            <p className="text-[11px] text-muted-foreground text-right tabular-nums">
              {state.bio.length}/300
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="yoursite.com"
                value={state.website}
                onChange={(e) => set("website", e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Social Links</Label>
            {[
              { icon: Instagram, key: "social_instagram" as const, ph: "Instagram handle" },
              { icon: Twitter, key: "social_twitter" as const, ph: "X / Twitter handle" },
              { icon: Youtube, key: "social_youtube" as const, ph: "YouTube channel" },
            ].map(({ icon: Icon, key, ph }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={ph}
                  value={state[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Save bar ── */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          {profile?.username && (
            <Link
              href={`/u/${profile.username}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View public profile &rarr;
            </Link>
          )}
          <div className={cn("flex items-center gap-3", !profile?.username && "ml-auto")}>
            <Button
              onClick={handleSave}
              disabled={!canSave || saving || uploading}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
