# Crystal Rose Game - Chrome Extension

Chrome extension that automates the flower-growing mini-game in the **Crystal Rose** event of Wild Rift.

## Features

- 💧 **Water Plants** — Waters all 6 plots sequentially
- 🌾 **Harvest** — Harvests all 6 plots, then claims reward automatically
- 🌱 **Plant Seed** — Plants a selected seed in all 6 plots, then claims reward automatically
- 🔄 **Reload** — Reloads the game tab and closes the popup

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

## Usage

1. Open the Crystal Rose game page: `crystalrosegame.wildrift.leagueoflegends.com`
2. Click the extension icon in Chrome toolbar
3. Wait for seeds to load, then use the buttons

## UI Layout

```
┌─────────────────────────────────────────┐
│  ✅ Status message here                  │
├──────────────────┬──────────────┬───────┤
│  💧 Water Plants │  🌾 Harvest  │  🔄  │
├─────────────────────────────────────────┤
│  🌱 Plant Seeds                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Seed (3) │ │ Seed (6) │ │ Seed (1) │ │
│  └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

## Status Messages

| Status                               | Meaning                               |
| ------------------------------------ | ------------------------------------- |
| `✅ Ready!`                          | Seeds loaded, ready to use            |
| `Watering plants...`                 | Water action in progress              |
| `✅ Watering complete! Success: 6/6` | Watering done                         |
| `✅ Harvest complete! Success: 6/6`  | Harvest done                          |
| `Claiming reward...`                 | Submitting reward after harvest/plant |
| `Reward claimed!`                    | Reward successfully claimed           |
| `⚠️ Claim reward failed`             | Reward already claimed or error       |
| `⚠️ Please reload the page!`         | Content script not ready              |
| `⚠️ Wrong tab!`                      | Not on the game page                  |
