"use client";

import { DragOverlay } from "@dnd-kit/core";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DEFAULT_DROP_ANIMATION, OVERLAY_MOTION } from "./constants";

type Id = string | number;

interface DragOverlayPortalProps {
  draggingId: Id | null;
  render: (id: Id) => ReactNode;
  dropAnimation?: Parameters<typeof DragOverlay>[0]["dropAnimation"];
  withHalo?: boolean;
}

export function DragOverlayPortal({
  draggingId,
  render,
  dropAnimation = DEFAULT_DROP_ANIMATION,
  withHalo = true,
}: DragOverlayPortalProps) {
  return (
    <DragOverlay
      dropAnimation={dropAnimation}
      style={{ transformOrigin: "0 0" }}
    >
      {draggingId ? (
        <motion.div
          initial={OVERLAY_MOTION.initial}
          animate={OVERLAY_MOTION.animate}
          exit={OVERLAY_MOTION.exit}
          transition={OVERLAY_MOTION.transition}
          className="z-[999] pointer-events-none shadow-2xl"
          style={{ filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))" }}
        >
          <div className="relative">
            {withHalo && (
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
            )}
            <div className="relative">{render(draggingId)}</div>
          </div>
        </motion.div>
      ) : null}
    </DragOverlay>
  );
}
