# Crystal Rose Game - Chrome Extension

Chrome extension that automates the flower-growing mini-game in the **Crystal Rose** event of Wild Rift.

---

## Guide

- After modifying any code, review this instruction file and update it if the change affects documented behavior, conventions, endpoints, or data models.

---

## File Structure

```
manifest.json       — Manifest V3, declares permissions & content script
index.html          — Popup UI (390px wide)
scripts/
  init.js           — Initializes popup, checks domain, loads seeds
  actions.js        — Handles button clicks in the popup
  handlers.js       — Content script running in the page, calls API
```

---

## Flow

1. Popup opens → `init.js` checks if the tab is on the correct domain.
2. Sends message `getSeeds` → `handlers.js` calls API → returns seed list.
3. `init.js` renders dynamic seed buttons into `#seedButtons .seed-grid`.
4. User clicks button → `actions.js` sends message → `handlers.js` calls the corresponding API.
5. After harvest or plant: `actions.js` waits 1s then sends `claimReward` message → `handlers.js` calls claim reward API.

---

## Domain & API

- **Popup domain check:** `crystalrosegame.wildrift.leagueoflegends.com`
- **API host:** `https://as.api.h5.wildrift.leagueoflegends.com/5c/crystalrose/pub`
- All requests use `credentials: "include"` (cookie auth) and `FormData` body.
- **200ms** delay between sequential requests to avoid rate limiting.

### Endpoints

| Action       | URL                                   | FormData params                 |
| ------------ | ------------------------------------- | ------------------------------- |
| Get seeds    | `POST /init?a=getBagStoreMissionData` | _(empty)_                       |
| Water plants | `POST /farm?a=water`                  | `landIndex` (1–6)               |
| Harvest      | `POST /farm?a=harvest`                | `landIndexs` (1–6) _(note 's')_ |
| Plant seed   | `POST /farm?a=plant`                  | `landIndex` (1–6), `cropId`     |
| Claim reward | `POST /mission?a=missionSubmit`       | `missionType=1`, `missionId`    |

### Reward IDs (claimed via `claimReward` after 1s delay)

- After plant → claim reward `7000003`
- After harvest → claim reward `7000004`

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

| Element ID        | Type                  | Description                                        |
| ----------------- | --------------------- | -------------------------------------------------- |
| `loading-overlay` | div                   | Full-screen spinner shown on load                  |
| `status`          | div                   | Displays status messages (fixed 2-line height)     |
| `waterBtn`        | button `.btn-water`   | Water plants (green), in action row                |
| `harvestBtn`      | button `.btn-harvest` | Harvest (orange), in action row                    |
| `reloadBtn`       | button `.btn-reload`  | Reload tab (🔄 icon), in action row                |
| `seedButtons`     | div                   | Container with `h3` title + `.seed-grid` inner div |

- Layout order (top → bottom): `#status` → `.action-row` → `#seedButtons`
- `.action-row`: flex row with Water | Harvest | Reload buttons side by side.
- Seed buttons are dynamically created in `renderSeedButtons()` with class `btn-seed`, injected into `#seedButtons .seed-grid`.
- `.seed-grid`: CSS grid, 3 columns, max 12 seeds.
- Button text format: `{seed.name} ({seed.quantity})`
- `dataset.seedId` = seed id passed into the `plantSeed` message.
- `#status` has fixed height (42px) to prevent layout shift when switching 1↔2 lines.

---

## Manifest

- **Manifest Version:** 3
- **Permissions:** `tabs`
- **Host permissions:** both domains (game + API)
- `handlers.js` is a **content script** running at `document_start` on the game page.
- `init.js` and `actions.js` run in the **popup** (not content scripts).

---

## Conventions

- Popup communicates with content script via `chrome.tabs.sendMessage`.
- `handlers.js` listens on `chrome.runtime.onMessage` and returns `true` to keep the channel open for async responses.
- API functions loop over **6 plots** (landIndex 1→6), sequentially, with 200ms delay.
- Success is determined by `data.msg === "success"`.
- `claimReward` is triggered from `actions.js` (not fire-and-forget in `handlers.js`) so status updates are visible in popup.
- No background service worker is used.
