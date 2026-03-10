// Content script - chạy trong page context để gọi API
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

      if (response.ok) {
        console.log(`✅ Ô ${landIndex} thành công:`, data);
        successCount++;
      } else {
        console.log(`❌ Ô ${landIndex} thất bại:`, data);
      }

      // Delay 200ms giữa các request để tránh bị rate limit
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Ô ${landIndex} lỗi:`, error);
    }
  }

  return { total, successCount };
}

async function harvestAllPlants() {
  const total = 6;
  let successCount = 0;

  // Gọi tuần tự từng ô một (không gọi song song)
  for (let landIndex = 1; landIndex <= total; landIndex++) {
    try {
      const formData = new FormData();
      formData.append("landIndexs", String(landIndex)); // Chú ý: landIndexs (có s)

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

      if (response.ok) {
        console.log(`✅ Thu hoạch ô ${landIndex} thành công:`, data);
        successCount++;
      } else {
        console.log(`❌ Thu hoạch ô ${landIndex} thất bại:`, data);
      }

      // Delay 200ms giữa các request để tránh bị rate limit
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Thu hoạch ô ${landIndex} lỗi:`, error);
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

    // Parse seeds từ response (cần xem structure của response để điều chỉnh)
    const { seeds } = data.jData.bag || [];

    return {
      seeds: seeds.map((seed) => ({
        id: seed.iItemId,
        name: seed.sItemName,
        quantity: seed.iAmount,
      })),
    };
  } catch (error) {
    console.error("❌ Lỗi lấy seeds:", error);
    return { seeds: [] };
  }
}

async function plantAllSeeds(seedId) {
  const total = 6;
  let successCount = 0;

  // Trồng tuần tự từng ô một
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

      if (response.ok) {
        console.log(`✅ Trồng ô ${landIndex} thành công:`, data);
        successCount++;
      } else {
        console.log(`❌ Trồng ô ${landIndex} thất bại:`, data);
      }

      // Delay 200ms
      if (landIndex < total) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`❌ Trồng ô ${landIndex} lỗi:`, error);
    }
  }

  return { total, successCount };
}
