# Crystal Rose Game - Chrome Extension

Chrome extension that automates the flower-growing mini-game in the **Crystal Rose** event of Wild Rift.

---

## Guide

- After modifying any code, review this instruction file and update it if the change affects documented behavior, conventions, endpoints, or data models.

---

## File Structure

```
manifest.json       — Manifest V3, declares permissions & content script
index.html          — Popup UI (300px wide)
scripts/
  init.js           — Initializes popup, retrieves cookie, loads seeds
  actions.js        — Handles button clicks in the popup
  handlers.js       — Content script running in the page, calls API
```

---

## Flow

1. Popup opens → `init.js` checks if the tab is on the correct domain.
2. `chrome.scripting.executeScript` is injected to retrieve `document.cookie`.
3. Sends message `getSeeds` → `handlers.js` calls API → returns seed list.
4. `init.js` renders dynamic seed buttons into `#seedButtons`.
5. User clicks button → `actions.js` sends message → `handlers.js` calls the corresponding API.

---

## Domain & API

- **Popup domain check:** `crystalrosegame.wildrift.leagueoflegends.com`
- **API host:** `https://as.api.h5.wildrift.leagueoflegends.com/5c/crystalrose/pub`
- All requests use `credentials: "include"` (cookie auth) and `FormData` body.
- **200ms** delay between sequential requests to avoid rate limiting.

### Endpoints

| Action         | URL                                   | FormData params                 |
| -------------- | ------------------------------------- | ------------------------------- |
| Get seeds      | `POST /init?a=getBagStoreMissionData` | _(empty)_                       |
| Water plants   | `POST /farm?a=water`                  | `landIndex` (1–6)               |
| Harvest        | `POST /farm?a=harvest`                | `landIndexs` (1–6) _(note 's')_ |
| Plant seed     | `POST /farm?a=plant`                  | `landIndex` (1–6), `cropId`     |
| Submit mission | `POST /mission?a=missionSubmit`       | `missionType=1`, `missionId`    |

### Mission IDs (fire-and-forget after 1s)

- After plant → submit mission `7000003`
- After harvest → submit mission `7000004`

---

## Data Model

### Seed object (mapped in `getSeeds()`)

```js
{
  (id, name, quantity);
}
// Source from API: iItemId, sItemName, iAmount
// Retrieved from: data.jData.bag.seeds[]
```

---

## UI (index.html)

| Element ID        | Type                  | Description                                 |
| ----------------- | --------------------- | ------------------------------------------- |
| `loading-overlay` | div                   | Full-screen spinner shown on load           |
| `reloadBtn`       | button `.btn-reload`  | Reload tab (icon 🔄)                        |
| `waterBtn`        | button `.btn-water`   | Water plants (green)                        |
| `harvestBtn`      | button `.btn-harvest` | Harvest (orange)                            |
| `seedButtons`     | div                   | Container for dynamic seed buttons (purple) |
| `status`          | div                   | Displays status messages                    |

- All buttons are hidden initially, shown after seeds load successfully.
- Seed buttons are dynamically created in `renderSeedButtons()` with class `btn-seed`.
- Button text format: `Plant {seed.name} ({seed.quantity})`
- `dataset.seedId` = seed id passed into the `plantSeed` message.

---

## Manifest

- **Manifest Version:** 3
- **Permissions:** `tabs`, `scripting`
- **Host permissions:** both domains (game + API)
- `handlers.js` is a **content script** running at `document_start` on the game page.
- `init.js` and `actions.js` run in the **popup** (not content scripts).

---

## Conventions

- Popup communicates with content script via `chrome.tabs.sendMessage`.
- `handlers.js` listens on `chrome.runtime.onMessage` and returns `true` to keep the channel open for async responses.
- API functions loop over **6 plots** (landIndex 1→6), sequentially, with 200ms delay.
- Success is determined by `data.msg === "success"`.
- No background service worker is used.
