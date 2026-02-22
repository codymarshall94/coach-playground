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
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Check,
  Globe,
  ImageIcon,
  Instagram,
  Loader2,
  Sparkles,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WizardState {
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

const INITIAL_STATE: WizardState = {
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

// Each step has hero content displayed in the left panel
const STEPS = [
  {
    label: "Basics",
    tagline: "LET'S GET STARTED",
    headline: "First things first.",
    description:
      "Your name is how athletes and coaches will find you. Choose whether you're building as an individual or representing a brand.",
    gradient: "from-emerald-500 to-cyan-500",
    bgGlow: "bg-emerald-500/20",
  },
  {
    label: "Username",
    tagline: "YOUR URL",
    headline: "Customize it.",
    description:
      "We auto-generated a username from your email. Keep it, or pick something better — this is the link you'll share everywhere.",
    gradient: "from-blue-500 to-indigo-500",
    bgGlow: "bg-blue-500/20",
  },
  {
    label: "About",
    tagline: "TELL YOUR STORY",
    headline: "The details that matter.",
    description:
      "A great bio and your social links help people trust you before they ever open one of your programs.",
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
  },
  {
    label: "Photos",
    tagline: "SHOW UP",
    headline: "Put a face to the name.",
    description:
      "Profiles with photos get noticed. Upload a headshot, brand logo, or cover image to make your page stand out.",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/20",
  },
  {
    label: "Done",
    tagline: "YOU'RE IN",
    headline: "Profile complete.",
    description:
      "You're ready to build, share, and coach. Welcome to PRGRM.",
    gradient: "from-emerald-400 to-green-500",
    bgGlow: "bg-emerald-500/20",
  },
] as const;

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

const heroVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileSetupWizard() {
  const router = useRouter();
  const { profile, refreshProfile } = useUserProfile();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<WizardState>(() => {
    if (!profile) return INITIAL_STATE;
    return {
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
    };
  });

  // Sync if profile loads after initial render
  const hasSynced = useRef(false);
  if (profile && !hasSynced.current) {
    hasSynced.current = true;
    setState((prev) => ({
      ...prev,
      full_name: prev.full_name || profile.full_name || "",
      account_type: (prev.account_type || profile.account_type || "personal") as AccountType,
      username: prev.username || profile.username || "",
      bio: prev.bio || profile.bio || "",
      brand_name: prev.brand_name || profile.brand_name || "",
      website: prev.website || profile.website || "",
      social_instagram: prev.social_instagram || profile.social_instagram || "",
      social_twitter: prev.social_twitter || profile.social_twitter || "",
      social_youtube: prev.social_youtube || profile.social_youtube || "",
      avatar_url: prev.avatar_url || profile.avatar_url || "",
      logo_url: prev.logo_url || profile.logo_url || "",
      cover_image_url: prev.cover_image_url || profile.cover_image_url || "",
    }));
  }

  const set = useCallback(
    <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
      setState((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const next = () => {
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return state.full_name.trim().length >= 2;
      case 1:
        return state.username.length >= 3;
      default:
        return true;
    }
  };

  const saveProfile = async () => {
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
        profile_completed: true,
      });
      await refreshProfile();
    } catch (err) {
      toast.error("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (step === STEPS.length - 2) {
      await saveProfile();
    }
    next();
  };

  // -----------------------------------------------------------------------
  // Image upload helpers
  // -----------------------------------------------------------------------

  const handleFileUpload = async (
    accept: string,
    uploadFn: (file: File) => Promise<string>,
    key: keyof WizardState,
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
      setSaving(true);
      try {
        const url = await uploadFn(file);
        set(key, url as WizardState[typeof key]);
        toast.success("Uploaded!");
      } catch (err) {
        toast.error("Upload failed");
        console.error(err);
      } finally {
        setSaving(false);
      }
    };
    input.click();
  };

  // -----------------------------------------------------------------------
  // Step form renderers (right panel)
  // -----------------------------------------------------------------------

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="full_name"
                placeholder="e.g. Alex Rivera"
                value={state.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                className="h-11"
                autoFocus
              />
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {state.username && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-muted/50 border p-3"
              >
                <p className="text-xs text-muted-foreground">
                  Your current username
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  prgrm.app/u/{state.username}
                </p>
              </motion.div>
            )}

            <UsernameSlugInput
              initialValue={state.username || state.full_name}
              currentUserId={profile?.id}
              onChange={(slug) => set("username", slug)}
            />

            <p className="text-[11px] text-muted-foreground">
              You can change this anytime from your profile settings.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
                  disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                  disabled={saving}
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
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center shadow-md"
              >
                <Sparkles className="w-4 h-4 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Looking good, {state.full_name.split(" ")[0] || "coach"}!
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Your profile is live. Start building programs and share them from
                your public page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/programs")}
              >
                My Programs
              </Button>
              {state.username && (
                <Button
                  className="flex-1"
                  onClick={() => router.push(`/u/${state.username}`)}
                >
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // -----------------------------------------------------------------------
  // Layout
  // -----------------------------------------------------------------------

  const isLastStep = step === STEPS.length - 1;
  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <motion.div
          className={cn("h-full bg-gradient-to-r", currentStep.gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ---- Left panel: Hero content ---- */}
        <div className="relative lg:w-[45%] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 px-8 py-12 lg:px-16 lg:py-0">
          {/* Animated glow */}
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30",
              currentStep.bgGlow,
            )}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={heroVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-5"
              >
                {/* Tagline pill */}
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.15em] uppercase",
                    "bg-white/10 text-white/70 backdrop-blur-sm",
                  )}
                >
                  {currentStep.tagline}
                </span>

                {/* Headline */}
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
                  {currentStep.headline}
                </h1>

                {/* Description */}
                <p className="text-base lg:text-lg leading-relaxed text-white/60 max-w-sm">
                  {currentStep.description}
                </p>

                {/* Step counter */}
                {!isLastStep && (
                  <div className="flex items-center gap-3 pt-4">
                    {STEPS.slice(0, -1).map((s, i) => (
                      <div
                        key={s.label}
                        className={cn(
                          "h-1 rounded-full transition-all duration-500",
                          i === step
                            ? "w-8 bg-white"
                            : i < step
                              ? "w-4 bg-white/40"
                              : "w-4 bg-white/15",
                        )}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Skip (mobile) */}
          {!isLastStep && (
            <div className="relative z-10 mt-6 lg:hidden">
              <button
                type="button"
                onClick={() => router.push("/programs")}
                className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>

        {/* ---- Right panel: Form ---- */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-16 lg:py-0">
          <div className="w-full max-w-md mx-auto">
            {/* Form content */}
            <div className="relative min-h-[420px] flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {renderForm()}
                </motion.div>
              </AnimatePresence>

              {/* Saving overlay */}
              {saving && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Navigation */}
            {!isLastStep && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prev}
                  disabled={step === 0 || saving}
                  className={cn(step === 0 && "invisible")}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  {/* Skip (desktop) */}
                  <button
                    type="button"
                    onClick={() => router.push("/programs")}
                    className="hidden lg:block text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip for now
                  </button>

                  <Button
                    onClick={handleNext}
                    disabled={!canAdvance() || saving}
                    className="min-w-[120px]"
                  >
                    {step === STEPS.length - 2 ? (
                      <>
                        Finish
                        <Check className="w-4 h-4 ml-1.5" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
