"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Logo } from "@/components/Logo";
import { SignUpWithProfileForm } from "./SignUpWithProfileForm";

export function SavePromptModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-5xl p-0 gap-0 overflow-hidden border-neutral-200 dark:border-neutral-800"
      >
        <DialogTitle className="sr-only">Save program</DialogTitle>
        <div className="grid md:grid-cols-[2fr_3fr]">
          {/* Left brand panel */}
          <div className="hidden md:flex flex-col justify-between bg-neutral-950 p-10 text-white">
            <Logo width={64} height={64} />
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] leading-tight mb-3">
                Your program is ready to save.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-400">
                Create an account to keep this program, access it anywhere, and
                start building more.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-xs text-neutral-400">
                  Real-time volume, load, and muscle balance analytics
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-xs text-neutral-400">
                  Export to PDF or share via your public profile
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-xs text-neutral-400">
                  No feature gates &mdash; everything is free
                </p>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="p-6 sm:p-10">
            <SignUpWithProfileForm
              onSuccess={() => {
                onClose();
                onSave();
              }}
              onCancel={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
