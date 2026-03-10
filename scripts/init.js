// File xử lý khởi tạo khi mở popup
let savedCookie = "";

window.addEventListener("DOMContentLoaded", async () => {
  const overlay = document.getElementById("loading-overlay");
  const status = document.getElementById("status");
  const targetDomain = "crystalrosegame.wildrift.leagueoflegends.com";

  try {
    // Lấy tab hiện tại
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Kiểm tra có đúng domain không
    if (!tab || !tab.url || !tab.url.includes(targetDomain)) {
      status.innerText = `⚠️ Hãy mở tab ${targetDomain}!`;

      // Ẩn tất cả các nút và chỉ hiện thông báo
      document.getElementById("waterBtn").style.display = "none";
      document.getElementById("harvestBtn").style.display = "none";
      document.getElementById("seedButtons").style.display = "none";

      overlay.style.display = "none";
      return;
    }

    // Inject script vào trang để lấy cookie
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.cookie,
    });

    savedCookie = results[0]?.result || "";

    if (savedCookie) {
      status.innerText = "✅ Đã lấy cookie thành công!";
      console.log("Cookie:", savedCookie);

      // Gọi API lấy danh sách seeds
      loadSeeds(tab.id);
    } else {
      status.innerText = "❌ Không tìm thấy cookie!";
    }
  } catch (error) {
    status.innerText = "❌ Lỗi khi lấy cookie!";
    console.error("Lỗi:", error);
  } finally {
    setTimeout(() => {
      overlay.style.display = "none";
    }, 0);
  }
});

async function loadSeeds(tabId) {
  try {
    // Gọi API qua content script để lấy danh sách seeds
    chrome.tabs.sendMessage(tabId, { action: "getSeeds" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        console.error(
          "Không lấy được seeds:",
          chrome.runtime.lastError?.message,
        );
        return;
      }

      const { seeds } = response;
      if (seeds && seeds.length > 0) {
        renderSeedButtons(seeds);
      }
    });
  } catch (error) {
    console.error("Lỗi khi load seeds:", error);
  }
}

function renderSeedButtons(seeds) {
  const container = document.getElementById("seedButtons");

  seeds.forEach((seed) => {
    const button = document.createElement("button");
    button.className = "btn-seed";
    button.textContent = `Trồng ${seed.name}`;
    button.dataset.seedId = seed.id;
    container.appendChild(button);
  });
}
