/**
 * Barrel Export
 * ------------------------------------------------------------
 * Purpose:
 *   Provide a clean public surface for the whole engine.
 *   App code should import from "@/engines" only.
 */

export * from "../core/types";
export * from "../core/constants";
export * from "../core/utils/math";
export * from "../core/utils/taxonomy";

export * from "../day/dayEngine";
export * from "../week/weekEngine";
export * from "../block/blockEngine";
export * from "../program/programEngine";
export * from "../program/profiles";
export * from "../coach/coachNudges";

export * from "./orchestrator";
