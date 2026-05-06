# Crystal Rose Game - Chrome Extension

Chrome extension that automates the flower-growing mini-game in the **Crystal Rose** event of Wild Rift.

## Features

- ⚡ **Auto** — Runs Water → Harvest → Plant (last seed) sequentially; claim reward after each; safe to close popup
- 💧 **Water** — Waters all 6 plots sequentially
- 🌾 **Harvest** — Harvests all 6 plots then claims reward automatically; safe to close popup
- 🌱 **Plant Seed** — Plants a selected seed in all 6 plots then claims reward automatically; safe to close popup
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
├───────┬────────────┬──────────┬─────┤
│ ⚡ Auto │ 💧 Water  │ 🌾 Harvest │  🔄 │
├─────────────────────────────────────────┤
│  🌱 Plant Seeds                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Seed (3) │ │ Seed (6) │ │ Seed (1) │ │
│  └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

## Status Messages

| Status                                         | Meaning                         |
| ---------------------------------------------- | ------------------------------- |
| `✅ Ready!`                                    | Seeds loaded, ready to use      |
| `Watering plants...`                           | Water action in progress        |
| `Watered (6/6)`                                | Watering done                   |
| `Harvesting...`                                | Harvest in progress             |
| `Harvested (6/6)`                              | Harvest done                    |
| `Harvested (6/6)\n✅ Reward claimed!`          | Harvest + reward success        |
| `Harvested (6/6)\n⚠️ Claim reward failed`      | Reward already claimed or error |
| `Planting [name]...`                           | Plant in progress               |
| `Planted [name] (6/6)\n✅ Reward claimed!`     | Plant + reward success          |
| `Planted [name] (6/6)\n⚠️ Claim reward failed` | Reward already claimed or error |
| `⚡ Auto running...\n(safe to close popup)`    | Auto sequence started           |
| `✅ Auto complete!`                            | Auto sequence finished          |
| `⚠️ Please reload the page!`                   | Content script not ready        |
| `⚠️ Wrong tab!`                                | Not on the game page            |
