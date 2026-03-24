// Initialize when popup opens
let savedCookie = "";

window.addEventListener("DOMContentLoaded", async () => {
  const overlay = document.getElementById("loading-overlay");
  const status = document.getElementById("status");
  const targetDomain = "crystalrosegame.wildrift.leagueoflegends.com";

  // Hide main buttons initially
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
      status.innerText = `⚠️ Please open ${targetDomain} tab!`;

      // Hide all buttons and show message only
      document.getElementById("reloadBtn").style.display = "none";
      document.getElementById("waterBtn").style.display = "none";
      document.getElementById("harvestBtn").style.display = "none";
      document.getElementById("seedButtons").style.display = "none";

      overlay.style.display = "none";
      return;
    }

    // Inject script to get cookies from page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.cookie,
    });

    savedCookie = results[0]?.result || "";

    if (savedCookie) {
      status.innerText = "✅ Cookies retrieved successfully!";
      console.log("Cookie:", savedCookie);

      // Call API to get seeds list
      loadSeeds(tab.id);
    } else {
      status.innerText = "❌ Cookies not found!";
    }
  } catch (error) {
    status.innerText = "❌ Error retrieving cookies!";
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
        console.error(
          "Failed to get seeds:",
          chrome.runtime.lastError?.message,
        );
        status.innerText = "⚠️ Please reload the page!";
        return;
      }

      const { seeds } = response;
      if (seeds && seeds.length >= 0) {
        // Successfully got seeds, show main buttons
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
  const container = document.getElementById("seedButtons");

  seeds.forEach((seed) => {
    const button = document.createElement("button");
    button.className = "btn-seed";
    button.textContent = `Plant ${seed.name}`;
    button.dataset.seedId = seed.id;
    container.appendChild(button);
  });
}
