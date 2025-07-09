import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ClearWorkoutDayModal({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/40"
        >
          Clear All
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear this workout day?</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            This will remove all exercises and sets from the current day. This
            action cannot be undone.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Clear Workout Day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
