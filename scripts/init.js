// Initialize when popup opens
window.addEventListener("DOMContentLoaded", async () => {
  const overlay = document.getElementById("loading-overlay");
  const status = document.getElementById("status");
  const targetDomain = "crystalrosegame.wildrift.leagueoflegends.com";

  // Hide main buttons initially
  document.getElementById("autoBtn").style.display = "none";
  document.getElementById("reloadBtn").style.display = "none";
  document.getElementById("waterBtn").style.display = "none";
  document.getElementById("harvestBtn").style.display = "none";
  document.getElementById("seedButtons").style.display = "none";

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Check if correct domain
    if (!tab || !tab.url || !tab.url.includes(targetDomain)) {
      status.innerText = `⚠️ Wrong tab! Please open the Crystal Rose game page.`;
      overlay.style.display = "none";
      return;
    }

    // Call API to get seeds list
    loadSeeds(tab.id);
  } catch (error) {
    status.innerText = "❌ Error initializing!";
    console.error("Error:", error);
  } finally {
    setTimeout(() => {
      overlay.style.display = "none";
    }, 0);
  }
});

async function loadSeeds(tabId) {
  const status = document.getElementById("status");

  try {
    // Call API via content script to get seeds list
    chrome.tabs.sendMessage(tabId, { action: "getSeeds" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        status.innerText = "⚠️ Please reload the page!";
        return;
      }

      const { seeds } = response;
      if (seeds && seeds.length >= 0) {
        // Successfully got seeds, show main buttons
        document.getElementById("autoBtn").style.display = "block";
        document.getElementById("reloadBtn").style.display = "block";
        document.getElementById("waterBtn").style.display = "block";
        document.getElementById("harvestBtn").style.display = "block";
        document.getElementById("seedButtons").style.display = "block";
        status.innerText = "✅ Ready!";

        // Render seed buttons if available
        if (seeds.length > 0) {
          renderSeedButtons(seeds);
        }
      } else {
        status.innerText = "⚠️ Please reload the page!";
      }
    });
  } catch (error) {
    console.warn("Error loading seeds:", error);
    status.innerText = "⚠️ Please reload the page!";
  }
}

function renderSeedButtons(seeds) {
  const grid = document.querySelector("#seedButtons .seed-grid");

  seeds.forEach((seed) => {
    const button = document.createElement("button");
    button.className = "btn-seed";
    button.textContent = `${seed.name} (${seed.quantity})`;
    button.dataset.seedId = seed.id;
    grid.appendChild(button);
  });
}
