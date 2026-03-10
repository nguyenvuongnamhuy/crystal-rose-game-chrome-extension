// File xử lý các action (button click)

document.getElementById("waterBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Đang tưới cây...";

  try {
    // Lấy tab hiện tại
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Gửi message đến handlers để gọi API
    chrome.tabs.sendMessage(tab.id, { action: "waterPlants" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "❌ Lỗi: Hãy reload trang web!";
        return;
      }

      const { total, successCount } = response;
      status.innerText = `✅ Tưới xong! Thành công: ${successCount}/${total}`;
    });
  } catch (error) {
    status.innerText = "Lỗi kết nối!";
    console.error("Lỗi:", error);
  }
});

document.getElementById("harvestBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Đang thu hoạch...";

  try {
    // Lấy tab hiện tại
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Gửi message đến handlers để gọi API
    chrome.tabs.sendMessage(tab.id, { action: "harvestPlants" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "❌ Lỗi: Hãy reload trang web!";
        return;
      }

      const { total, successCount } = response;
      status.innerText = `✅ Thu hoạch xong! Thành công: ${successCount}/${total}`;
    });
  } catch (error) {
    status.innerText = "Lỗi kết nối!";
    console.error("Lỗi:", error);
  }
});

// Event delegation cho các button seed (vì được tạo động)
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
          status.innerText = "❌ Lỗi: Hãy reload trang web!";
          return;
        }

        const { total, successCount } = response;
        status.innerText = `✅ ${seedName} xong! Thành công: ${successCount}/${total}`;
      },
    );
  } catch (error) {
    status.innerText = "Lỗi kết nối!";
    console.error("Lỗi:", error);
  }
});
