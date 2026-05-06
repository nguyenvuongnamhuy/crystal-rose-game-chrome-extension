// Handle actions (button clicks)

document.getElementById("autoBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "⚡ Auto running...\n(safe to close popup)";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const seedButtons = document.querySelectorAll(
      "#seedButtons .seed-grid .btn-seed",
    );
    const lastSeed =
      seedButtons.length > 0 ? seedButtons[seedButtons.length - 1] : null;
    const seedId = lastSeed ? lastSeed.dataset.seedId : null;

    // Hand off to content script — runs even after popup closes
    chrome.tabs.sendMessage(tab.id, { action: "autoRun", seedId }, () => {
      if (chrome.runtime.lastError) return;
      status.innerText = "✅ Auto complete!";
    });
  } catch (error) {
    status.innerText = "❌ Auto error!";
    console.error("Error:", error);
  }
});

document.getElementById("reloadBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.reload(tab.id);
    window.close(); // Close popup after reload
  } catch (error) {
    console.error("Error reloading:", error);
  }
});

document.getElementById("waterBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Watering plants...";

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Send message to handlers to call API
    chrome.tabs.sendMessage(tab.id, { action: "waterPlants" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "❌ Error: Please reload the page!";
        return;
      }

      const { total, successCount } = response;
      status.innerText = `Watered (${successCount}/${total})`;
    });
  } catch (error) {
    status.innerText = "Connection error!";
    console.error("Error:", error);
  }
});

document.getElementById("harvestBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Harvesting...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "harvestAndClaim" },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          status.innerText = "❌ Error: Please reload the page!";
          return;
        }
        const { total, successCount, reward } = response;
        if (reward && reward.msg === "success") {
          status.innerText = `Harvested (${successCount}/${total})\n✅ Reward claimed!`;
        } else {
          status.innerText = `Harvested (${successCount}/${total})\n⚠️ Claim reward failed`;
        }
      },
    );
  } catch (error) {
    status.innerText = "Connection error!";
    console.error("Error:", error);
  }
});

// Event delegation for seed buttons (created dynamically)
document.getElementById("seedButtons").addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btn-seed")) return;

  const status = document.getElementById("status");
  const seedId = e.target.dataset.seedId;
  const seedName = e.target.textContent
    .replace(/^Plant\s+/, "")
    .replace(/\s*\(\d+\)$/, "");

  status.innerText = `Planting ${seedName}...`;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "plantAndClaim", seedId },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          status.innerText = "❌ Error: Please reload the page!";
          return;
        }
        const { total, successCount, reward } = response;
        if (reward && reward.msg === "success") {
          status.innerText = `Planted ${seedName} (${successCount}/${total})\n✅ Reward claimed!`;
        } else {
          status.innerText = `Planted ${seedName} (${successCount}/${total})\n⚠️ Claim reward failed`;
        }
      },
    );
  } catch (error) {
    status.innerText = "Connection error!";
    console.error("Error:", error);
  }
});
