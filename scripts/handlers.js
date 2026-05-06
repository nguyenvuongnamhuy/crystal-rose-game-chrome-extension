// Content script - runs in page context to call API
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "waterPlants") {
    waterAllPlants().then(sendResponse);
    return true; // Keep channel open for async response
  }
  if (request.action === "harvestPlants") {
    harvestAllPlants().then(sendResponse);
    return true; // Keep channel open for async response
  }
  if (request.action === "getSeeds") {
    getSeeds().then(sendResponse);
    return true; // Keep channel open for async response
  }
  if (request.action === "plantSeed") {
    plantAllSeeds(request.seedId).then(sendResponse);
    return true; // Keep channel open for async response
  }
  if (request.action === "claimReward") {
    claimReward(request.rewardId).then(sendResponse);
    return true;
  }
});

const host =
  "https://as.api.h5.wildrift.leagueoflegends.com/5c/crystalrose/pub";

async function waterAllPlants() {
  const total = 6;
  let successCount = 0;

  // Gọi tuần tự từng ô một (không gọi song song)
  for (let landIndex = 1; landIndex <= total; landIndex++) {
    try {
      const formData = new FormData();
      formData.append("landIndex", String(landIndex));

      const response = await fetch(`${host}/farm?a=water`, {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6",
          origin: "https://crystalrosegame.wildrift.leagueoflegends.com",
          referer: "https://crystalrosegame.wildrift.leagueoflegends.com/",
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.msg === "success") {
        console.log(`✅ Plot ${landIndex} success:`, data);
        successCount++;
      } else {
        console.log(`❌ Plot ${landIndex} failed:`, data);
      }

      // Delay 200ms between requests to avoid rate limit
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Plot ${landIndex} error:`, error);
    }
  }

  return { total, successCount };
}

async function harvestAllPlants() {
  const total = 6;
  let successCount = 0;

  // Call sequentially for each plot (not in parallel)
  for (let landIndex = 1; landIndex <= total; landIndex++) {
    try {
      const formData = new FormData();
      formData.append("landIndexs", String(landIndex)); // Note: landIndexs (with s)

      const response = await fetch(`${host}/farm?a=harvest`, {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6",
          origin: "https://crystalrosegame.wildrift.leagueoflegends.com",
          referer: "https://crystalrosegame.wildrift.leagueoflegends.com/",
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.msg === "success") {
        console.log(`✅ Harvest plot ${landIndex} success:`, data);
        successCount++;
      } else {
        console.log(`❌ Harvest plot ${landIndex} failed:`, data);
      }

      // Delay 200ms between requests to avoid rate limit
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Harvest plot ${landIndex} error:`, error);
    }
  }

  return { total, successCount };
}

async function getSeeds() {
  try {
    const response = await fetch(`${host}/init?a=getBagStoreMissionData`, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6",
        origin: "https://crystalrosegame.wildrift.leagueoflegends.com",
        referer: "https://crystalrosegame.wildrift.leagueoflegends.com/",
      },
      body: new FormData(), // Empty FormData
      credentials: "include",
    });

    const data = await response.json();
    console.log("📦 Seeds data:", data);

    // Parse seeds from response (adjust based on response structure)
    const { seeds } = data.jData.bag || [];

    return {
      seeds: seeds.map((seed) => ({
        id: seed.iItemId,
        name: seed.sItemName,
        quantity: seed.iAmount,
      })),
    };
  } catch (error) {
    console.warn("❌ Error getting seeds:", error);
    return { seeds: [] };
  }
}

async function plantAllSeeds(seedId) {
  const total = 6;
  let successCount = 0;

  // Plant sequentially for each plot
  for (let landIndex = 1; landIndex <= total; landIndex++) {
    try {
      const formData = new FormData();
      formData.append("landIndex", String(landIndex));
      formData.append("cropId", String(seedId));

      const response = await fetch(`${host}/farm?a=plant`, {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6",
          origin: "https://crystalrosegame.wildrift.leagueoflegends.com",
          referer: "https://crystalrosegame.wildrift.leagueoflegends.com/",
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.msg === "success") {
        console.log(`✅ Plant plot ${landIndex} success:`, data);
        successCount++;
      } else {
        console.log(`❌ Plant plot ${landIndex} failed:`, data);
      }

      // Delay 200ms
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Plant plot ${landIndex} error:`, error);
    }
  }

  return { total, successCount };
}

async function claimReward(rewardId) {
  try {
    const formData = new FormData();
    formData.append("missionType", "1");
    formData.append("missionId", String(rewardId));

    const response = await fetch(`${host}/mission?a=missionSubmit`, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6",
        origin: "https://crystalrosegame.wildrift.leagueoflegends.com",
        referer: "https://crystalrosegame.wildrift.leagueoflegends.com/",
      },
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    if (data.msg === "success") {
      console.log("✅ Claim reward success:", data);
    } else {
      console.log("❌ Claim reward failed:", data);
    }
    return data;
  } catch (error) {
    console.log("❌ Claim reward error:", error);
  }
}
