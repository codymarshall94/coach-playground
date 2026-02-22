"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  publishProgram,
  unpublishProgram,
  updateProgramPricing,
} from "@/services/programService";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  DollarSign,
  Globe,
  Loader2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

interface PublishPanelProps {
  programId: string;
  /** Whether the program has been saved at least once */
  isSaved: boolean;
  isPublished: boolean;
  price: number | null;
  currency: string;
  /** The version ID currently published (null = no snapshot) */
  publishedVersionId: string | null;
  /** Whether the program has unsaved local changes in the builder */
  hasUnsavedChanges: boolean;
  onPublishChange: (published: boolean, versionId: string | null) => void;
  onPricingChange: (price: number | null, currency: string) => void;
  /** Opens the full-page publish flow for first-time publish */
  onOpenPublishFlow?: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function PublishPanel({
  programId,
  isSaved,
  isPublished,
  price,
  currency,
  publishedVersionId,
  hasUnsavedChanges,
  onPublishChange,
  onPricingChange,
  onOpenPublishFlow,
}: PublishPanelProps) {
  const [loading, setLoading] = useState(false);
  const [priceInput, setPriceInput] = useState(
    price != null && price > 0 ? price.toString() : ""
  );
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  const isFree = !priceInput || parseFloat(priceInput) <= 0;

  /* ---- Publish (with confirmation) ---- */
  const handlePublish = useCallback(async () => {
    setShowPublishConfirm(false);
    setLoading(true);
    try {
      const parsedPrice = parseFloat(priceInput);
      const finalPrice =
        !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;
      const result = await publishProgram(programId, {
        price: finalPrice,
        currency,
      });
      onPublishChange(true, result.versionId);
      toast.success(
        finalPrice
          ? `Program published at $${finalPrice.toFixed(2)}`
          : "Program published as free"
      );
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish program");
    } finally {
      setLoading(false);
    }
  }, [programId, priceInput, currency, onPublishChange]);

  /* ---- Unpublish (with confirmation) ---- */
  const handleUnpublish = useCallback(async () => {
    setShowUnpublishConfirm(false);
    setLoading(true);
    try {
      await unpublishProgram(programId);
      onPublishChange(false, null);
      toast.success("Program unpublished");
    } catch (err) {
      console.error("Unpublish error:", err);
      toast.error("Failed to unpublish program");
    } finally {
      setLoading(false);
    }
  }, [programId, onPublishChange]);

  /* ---- Save pricing ---- */
  const handleSavePricing = useCallback(async () => {
    const parsedPrice = parseFloat(priceInput);
    const finalPrice =
      !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;

    setLoading(true);
    try {
      await updateProgramPricing(programId, finalPrice, currency);
      onPricingChange(finalPrice, currency);
      toast.success(
        finalPrice
          ? `Price updated to $${finalPrice.toFixed(2)}`
          : "Set to free"
      );
    } catch (err) {
      console.error("Pricing update error:", err);
      toast.error("Failed to update pricing");
    } finally {
      setLoading(false);
    }
  }, [priceInput, programId, currency, onPricingChange]);

  const currentPriceStr = price != null && price > 0 ? price.toString() : "";
  const pricingChanged = priceInput !== currentPriceStr;

  return (
    <>
      <div className="space-y-4">
        <Label className="text-sm font-medium">Publish</Label>

        {/* Status badge */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
            isPublished
              ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
              : "border-border bg-muted/30 text-muted-foreground"
          )}
        >
          {isPublished ? (
            <Globe className="w-4 h-4 shrink-0" />
          ) : (
            <Lock className="w-4 h-4 shrink-0" />
          )}
          <span className="flex-1">
            {isPublished
              ? "Published — visible to everyone"
              : "Draft — only you can see this"}
          </span>
        </div>

        {/* Unpublished changes warning */}
        {isPublished && publishedVersionId && hasUnsavedChanges && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              You have unpublished changes. The public still sees your last
              published version. Re-publish to update.
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Pricing</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00 (free)"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
            </div>
            {isPublished && pricingChanged && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={handleSavePricing}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isFree
              ? "Anyone can view this program for free."
              : `Viewers will see the $${parseFloat(priceInput).toFixed(2)} price. Payments via Stripe coming soon.`}
          </p>
        </div>

        {/* Action buttons */}
        {isPublished ? (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="default"
              size="sm"
              onClick={() => setShowPublishConfirm(true)}
              disabled={loading || !isSaved || hasUnsavedChanges}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              )}
              Re-publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnpublishConfirm(true)}
              disabled={loading}
              className="text-destructive hover:text-destructive"
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            variant="default"
            size="sm"
            onClick={() => {
              if (onOpenPublishFlow) {
                onOpenPublishFlow();
              } else {
                setShowPublishConfirm(true);
              }
            }}
            disabled={loading || !isSaved || hasUnsavedChanges}
          >
            {loading && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Publish Program
          </Button>
        )}

        {!isSaved && (
          <p className="text-[11px] text-destructive">
            Save your program before publishing.
          </p>
        )}

        {isSaved && hasUnsavedChanges && (
          <p className="text-[11px] text-destructive">
            Save your changes before publishing.
          </p>
        )}
      </div>

      {/* ---- Publish confirmation ---- */}
      <AlertDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPublished ? "Re-publish program?" : "Publish program?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                {isPublished
                  ? "This will snapshot your current program and replace the publicly visible version. Anyone viewing this program will see the updated content."
                  : "This will create a snapshot of your current program and make it publicly visible. You can continue editing privately — changes won\u2019t be public until you re-publish."}
              </span>
              <span className="block text-foreground/80 font-medium">
                {isFree
                  ? "Price: Free"
                  : `Price: $${parseFloat(priceInput).toFixed(2)}`}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>
              {isPublished ? "Re-publish" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- Unpublish confirmation ---- */}
      <AlertDialog
        open={showUnpublishConfirm}
        onOpenChange={setShowUnpublishConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish program?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                This will remove your program from public view. Anyone with the
                link will no longer be able to see it.
              </span>
              <span className="block text-foreground/80">
                Your program data and version history will be preserved — you can
                re-publish anytime.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnpublish}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Unpublish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
