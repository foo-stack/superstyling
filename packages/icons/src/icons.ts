/**
 * Initial icon set for v0.1. All paths are designed for a 24×24 viewBox and
 * rely on the default stroke attrs in `createIcon` (`strokeWidth=2`, round
 * caps/joins, `fill="none"`). Adding a new icon is usually two lines.
 *
 * Naming convention: `{Concept}Icon` — matches Chakra v2's convention so
 * migrators see familiar names.
 */
import { createIcon } from "./createIcon";

// ─── Chevrons ────────────────────────────────────────────────────────────
export const ChevronDownIcon = createIcon({
  displayName: "ChevronDownIcon",
  paths: ["M6 9l6 6 6-6"],
});
export const ChevronUpIcon = createIcon({
  displayName: "ChevronUpIcon",
  paths: ["M18 15l-6-6-6 6"],
});
export const ChevronLeftIcon = createIcon({
  displayName: "ChevronLeftIcon",
  paths: ["M15 18l-6-6 6-6"],
});
export const ChevronRightIcon = createIcon({
  displayName: "ChevronRightIcon",
  paths: ["M9 18l6-6-6-6"],
});

// ─── Arrows ──────────────────────────────────────────────────────────────
export const ArrowUpIcon = createIcon({
  displayName: "ArrowUpIcon",
  paths: ["M12 19V5", "M5 12l7-7 7 7"],
});
export const ArrowDownIcon = createIcon({
  displayName: "ArrowDownIcon",
  paths: ["M12 5v14", "M19 12l-7 7-7-7"],
});
export const ArrowLeftIcon = createIcon({
  displayName: "ArrowLeftIcon",
  paths: ["M19 12H5", "M12 19l-7-7 7-7"],
});
export const ArrowRightIcon = createIcon({
  displayName: "ArrowRightIcon",
  paths: ["M5 12h14", "M12 5l7 7-7 7"],
});

// ─── Close / Check / Plus / Minus ─────────────────────────────────────────
export const CloseIcon = createIcon({
  displayName: "CloseIcon",
  paths: ["M18 6L6 18", "M6 6l12 12"],
});
export const CheckIcon = createIcon({
  displayName: "CheckIcon",
  paths: ["M20 6L9 17l-5-5"],
});
export const PlusIcon = createIcon({
  displayName: "PlusIcon",
  paths: ["M12 5v14", "M5 12h14"],
});
export const MinusIcon = createIcon({
  displayName: "MinusIcon",
  paths: ["M5 12h14"],
});

// ─── Status icons (used by Alert) ────────────────────────────────────────
export const InfoIcon = createIcon({
  displayName: "InfoIcon",
  paths: [
    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
    "M12 16v-4",
    "M12 8h.01",
  ],
});
export const CheckCircleIcon = createIcon({
  displayName: "CheckCircleIcon",
  paths: ["M22 11.08V12a10 10 0 11-5.93-9.14", "M22 4L12 14.01l-3-3"],
});
export const WarningIcon = createIcon({
  displayName: "WarningIcon",
  paths: [
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
});
export const ErrorIcon = createIcon({
  displayName: "ErrorIcon",
  paths: [
    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
    "M15 9l-6 6",
    "M9 9l6 6",
  ],
});

// ─── Common UI ───────────────────────────────────────────────────────────
export const SearchIcon = createIcon({
  displayName: "SearchIcon",
  paths: ["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.35-4.35"],
});
export const MenuIcon = createIcon({
  displayName: "MenuIcon",
  paths: ["M3 12h18", "M3 6h18", "M3 18h18"],
});
export const SettingsIcon = createIcon({
  displayName: "SettingsIcon",
  paths: [
    "M12 15a3 3 0 100-6 3 3 0 000 6z",
    "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  ],
});
export const MoreHorizontalIcon = createIcon({
  displayName: "MoreHorizontalIcon",
  paths: [
    "M12 13a1 1 0 100-2 1 1 0 000 2z",
    "M19 13a1 1 0 100-2 1 1 0 000 2z",
    "M5 13a1 1 0 100-2 1 1 0 000 2z",
  ],
});
export const EditIcon = createIcon({
  displayName: "EditIcon",
  paths: [
    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
    "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  ],
});
export const TrashIcon = createIcon({
  displayName: "TrashIcon",
  paths: [
    "M3 6h18",
    "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
    "M10 11v6",
    "M14 11v6",
  ],
});
export const ExternalLinkIcon = createIcon({
  displayName: "ExternalLinkIcon",
  paths: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6", "M15 3h6v6", "M10 14L21 3"],
});
export const SunIcon = createIcon({
  displayName: "SunIcon",
  paths: [
    "M12 17a5 5 0 100-10 5 5 0 000 10z",
    "M12 1v2",
    "M12 21v2",
    "M4.22 4.22l1.42 1.42",
    "M18.36 18.36l1.42 1.42",
    "M1 12h2",
    "M21 12h2",
    "M4.22 19.78l1.42-1.42",
    "M18.36 5.64l1.42-1.42",
  ],
});
export const MoonIcon = createIcon({
  displayName: "MoonIcon",
  paths: ["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"],
});
