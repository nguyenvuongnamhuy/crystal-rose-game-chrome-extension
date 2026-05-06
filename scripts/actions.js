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
      status.innerText = `✅ Harvest complete! Success: ${successCount}/${total}
Claiming reward...`;

      setTimeout(() => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "claimReward", rewardId: "7000004" },
          (rewardRes) => {
            if (
              chrome.runtime.lastError ||
              !rewardRes ||
              rewardRes.msg !== "success"
            ) {
              status.innerText = `✅ Harvest complete! Success: ${successCount}/${total}\n⚠️ Claim reward failed`;
              return;
            }
            status.innerText = `✅ Harvest complete! Success: ${successCount}/${total}\nReward claimed!`;
          },
        );
      }, 1000);
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
      { action: "plantSeed", seedId: seedId },
      (response) => {
        if (chrome.runtime.lastError) {
          status.innerText = "❌ Error: Please reload the page!";
          return;
        }

        const { total, successCount } = response;
        status.innerText = `✅ ${seedName} planted! Success: ${successCount}/${total}
Claiming reward...`;

        setTimeout(() => {
          chrome.tabs.sendMessage(
            tab.id,
            { action: "claimReward", rewardId: "7000003" },
            (rewardRes) => {
              if (
                chrome.runtime.lastError ||
                !rewardRes ||
                rewardRes.msg !== "success"
              ) {
                status.innerText = `✅ ${seedName} planted! Success: ${successCount}/${total}
⚠️ Claim reward failed`;
                return;
              }
              status.innerText = `✅ ${seedName} planted! Success: ${successCount}/${total}
Reward claimed!`;
            },
          );
        }, 1000);
      },
    );
  } catch (error) {
    status.innerText = "Connection error!";
    console.error("Error:", error);
  }
});
