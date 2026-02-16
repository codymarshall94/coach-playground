"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent>
        <DialogTitle className="sr-only">Save program</DialogTitle>
        <SignUpWithProfileForm
          onSuccess={() => {
            onClose();
            onSave();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
