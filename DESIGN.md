---
name: Moodfy
description: Minimal mood-to-music discovery with AI-generated color atmospheres
colors:
  canvas-black: "oklch(0 0 0)"
  text-primary: "oklch(0.93 0 0)"
  text-secondary: "oklch(0.68 0.01 250)"
  text-tertiary: "oklch(0.58 0.01 250)"
  accent: "oklch(0.58 0.19 252)"
  accent-hover: "oklch(0.63 0.19 252)"
  surface-grouped: "oklch(0.16 0.005 250 / 0.55)"
  fill-secondary: "oklch(1 0 0 / 0.06)"
  fill-secondary-hover: "oklch(1 0 0 / 0.09)"
  separator: "oklch(1 0 0 / 0.06)"
  error: "oklch(0.65 0.2 25)"
  error-surface: "oklch(0.65 0.2 25 / 0.1)"
typography:
  display:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  subhead:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  caption:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "10px"
  full: "9999px"
spacing:
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
components:
  input-search:
    backgroundColor: "{colors.fill-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    typography: "body"
    height: "40px"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "oklch(1 0 0)"
    rounded: "{rounded.full}"
    padding: "8px 18px"
    typography: "subhead"
    height: "34px"
  chip-preset:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
    typography: "caption"
  track-list:
    backgroundColor: "{colors.surface-grouped}"
    rounded: "{rounded.md}"
    typography: "subhead"
  text-button:
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    typography: "caption"
---

# Design System: Moodfy

## Overview

**Creative North Star: "The Midnight Mood Canvas"**

Moodfy is a minimal mood-to-music discovery app. True black canvas, quiet UI chrome, and AI-generated color orbs that bloom when results arrive. Every element earns its place — nothing decorative, nothing loud.

The flow is a single line: describe a feeling, tap Gerar, discover tracks. Typography is system-native and light. Surfaces are translucent and barely there. The emotional payload lives in the background atmosphere, not in the interface.

**Key Characteristics:**
- OLED black canvas with vivid AI mood orbs as atmosphere
- Compact inline input + action pattern
- One accent color for interactive elements only
- Ghost-outline chips and grouped track lists
- State-driven motion with full reduced-motion support

Reject chaotic layouts, corporate streaming-app mimicry, cramped grids, and soulless algorithmic aesthetics. Calm and human-centered, even when colorful.

## Colors

**Restrained chrome, committed atmosphere.** UI uses black, translucent fills, and one accent. Mood colors carry the emotional weight in the background layer only.

### Primary
- **Accent Blue** (oklch(0.58 0.19 252)): Compact "Gerar" button, "Ouvir" text actions, focus rings. The only fixed accent in the UI.

### Secondary
- **Translucent Fill** (oklch(1 0 0 / 0.06)): Search field background. Hover lifts to oklch(1 0 0 / 0.09).

### Tertiary
- **Mood Orbs** (runtime hex from AI): Three radial gradients drift behind a light oklch(0 0 0 / 0.20) scrim. Atmosphere only — never on UI chrome.

### Neutral
- **Canvas Black** (oklch(0 0 0)): Page background.
- **Primary Text** (oklch(0.93 0 0)): Default reading color.
- **Secondary Text** (oklch(0.68 0.01 250)): Mood description, artist names, chip labels.
- **Tertiary Text** (oklch(0.58 0.01 250)): Placeholders.
- **Grouped Surface** (oklch(0.16 0.005 250 / 0.55)): Track list with light blur(24px).
- **Separator** (oklch(1 0 0 / 0.06)): 0.5px hairlines between list items.

### Named Rules

**The Atmosphere Rule.** Mood colors live in the background layer only. UI chrome uses system tokens.

**The One Accent Rule.** Accent blue is the sole fixed color in interactive elements.

## Typography

**Font:** system-ui stack. One family, multiple weights. No web fonts.

**Character:** Light, quiet, subordinate to color and motion.

### Hierarchy
- **Display** (500, 18px, 1.35 line-height, -0.01em tracking): AI mood description. Muted secondary color.
- **Body** (400, 16px, 1.5 line-height): Search input text.
- **Subhead** (400, 15px): Track titles.
- **Caption** (400, 13px): Artist names, chips, errors, text buttons.

### Named Rules

**The Quiet Type Rule.** Weight 500 maximum on display text. Never bold for emphasis — size and color carry hierarchy.

## Elevation

Flat and tonal. No drop shadows. Depth through translucency and grouping.

### Layer Vocabulary
- **Grouped list**: surface-grouped + blur(24px). Track results.
- **Search field**: fill-secondary, no blur. Lowest elevation.
- **Focus ring**: 2px accent at 45% opacity.

### Named Rules

**The Flat Chrome Rule.** No shadows. Elevation is blur and opacity only.

## Components

### Search + Generate (inline)
- **Layout:** Input and compact button on one row, max-width 384px
- **Input:** 40px height, full pill, fill-secondary, body text
- **Button:** 34px height, "Gerar" label (not full-width), subhead text, weight 500, accent fill

### Mood Preset Chips
- **Style:** Ghost outline — transparent bg, 0.5px separator border, caption text
- **Hover:** Subtle fill-secondary background, foreground text
- **No fill at rest** — minimal visual weight

### Grouped Track List
- **Shape:** 10px radius, lighter grouped surface
- **Rows:** 36px album art, subhead title, caption artist, text-only "Ouvir" action
- **Separators:** 0.5px hairlines between items

### Mood Background
- **Orbs:** Three 62vw radial gradients at 60% opacity, slow drift
- **Scrim:** oklch(0 0 0 / 0.20) — preserves color visibility

### Color Dots
- **Size:** 20px, no ring border. Minimal markers below mood text.

## Do's and Don'ts

### Do:
- **Do** keep the interface sparse — one input row, one action, results below.
- **Do** let AI mood colors dominate the background after generation.
- **Do** use ghost-outline chips instead of filled pills.
- **Do** respect `prefers-reduced-motion`.

### Don't:
- **Don't** mimic corporate streaming-app dark themes or cramped grids.
- **Don't** create chaotic layouts or visual noise.
- **Don't** apply mood colors to buttons, borders, or UI chrome.
- **Don't** use full-width primary buttons — keep actions compact.
- **Don't** use gradient text or decorative icons.
- **Don't** add drop shadows.
