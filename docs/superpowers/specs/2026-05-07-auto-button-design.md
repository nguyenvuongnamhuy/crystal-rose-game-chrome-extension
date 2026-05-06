# Auto Button — Design Spec

**Date:** 2026-05-07

## Summary

Add a single "Auto" button that runs Water → Harvest → Plant sequentially. Each step that fails is skipped; only one success is required for the overall run to be useful.

---

## UI

**Button order in `.action-row`:**

```
[ ⚡ Auto ] [ 💧 Water ] [ 🌾 Harvest ] [ 🔄 ]
```

- Button ID: `autoBtn`
- Class: `btn-auto`
- Color: `#2980b9` (blue), hover `#2471a3`
- Shown/hidden alongside other action buttons in `init.js`

---

## Logic (handlers.js — content script)

All sequences run entirely in `handlers.js` so closing the popup does not interrupt them.

**`autoRun(seedId)`** — triggered by Auto button:

1. `waterAllPlants()` → log result
2. `harvestAllPlants()` → wait 1s → `claimReward("7000004")`
3. If seedId: `plantAllSeeds(seedId)` → wait 1s → `claimReward("7000003")`

**`harvestAndClaim()`** — triggered by Harvest button:

1. `harvestAllPlants()` → wait 1s → `claimReward("7000004")` → return `{ total, successCount, reward }`

**`plantAndClaim(seedId)`** — triggered by Plant seed button:

1. `plantAllSeeds(seedId)` → wait 1s → `claimReward("7000003")` → return `{ total, successCount, reward }`

`actions.js` sends the message and updates status from the response (if popup still open).

Each step failure is silently skipped (no abort). Status is overwritten per phase.

---

## Status message sequence

**Auto:**

```
⚡ Auto running...
(safe to close popup)
→ ✅ Auto complete!  (if popup still open)
```

**Harvest button:**

```
Harvesting...
Harvested (x/6)
✅ Reward claimed!  /  ⚠️ Claim reward failed
```

**Plant seed button:**

```
Planting [name]...
Planted [name] (x/6)
✅ Reward claimed!  /  ⚠️ Claim reward failed
```

Each line overwrites the previous in `#status`.

---

## Files changed

| File                              | Change                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `index.html`                      | Add `autoBtn` before `waterBtn` in `.action-row`; add `.btn-auto` CSS                 |
| `scripts/init.js`                 | Hide/show `autoBtn` alongside other buttons                                           |
| `scripts/actions.js`              | `autoBtn` fires `autoRun`; harvest uses `harvestAndClaim`; plant uses `plantAndClaim` |
| `scripts/handlers.js`             | Add `autoRun`, `harvestAndClaim`, `plantAndClaim` composite handlers                  |
| `.github/copilot-instructions.md` | Update UI table, Flow, and Conventions sections                                       |
| `README.md`                       | Update Features, UI Layout, and Status Messages                                       |
