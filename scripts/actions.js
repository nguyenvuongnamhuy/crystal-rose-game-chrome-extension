// Handle actions (button clicks)

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
      status.innerText = `✅ Watering complete! Success: ${successCount}/${total}`;
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
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Send message to handlers to call API
    chrome.tabs.sendMessage(tab.id, { action: "harvestPlants" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "❌ Error: Please reload the page!";
        return;
      }

      const { total, successCount } = response;
      status.innerText = `✅ Harvest complete! Success: ${successCount}/${total}`;
    });
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
  const seedName = e.target.textContent;

  status.innerText = `${seedName}...`;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "plantSeed", seedId: seedId },
      (response) => {
        if (chrome.runtime.lastError) {
          status.innerText = "❌ Error: Please reload the page!";
          return;
        }

        const { total, successCount } = response;
        status.innerText = `✅ ${seedName} complete! Success: ${successCount}/${total}`;
      },
    );
  } catch (error) {
    status.innerText = "Connection error!";
    console.error("Error:", error);
  }
});
