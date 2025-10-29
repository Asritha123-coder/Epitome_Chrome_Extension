document.addEventListener("DOMContentLoaded", () => {
  const apiInput = document.getElementById("api-key");
  const saveButton = document.getElementById("save-button");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  const mask = (s) => {
    if (!s) return "";
    return s.length > 8 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s;
  };

  const showSuccess = (text = "Settings saved successfully!") => {
    if (errorMessage) errorMessage.style.display = "none";
    if (successMessage) {
      successMessage.textContent = text;
      successMessage.style.display = "block";
      setTimeout(() => (successMessage.style.display = "none"), 2000);
    }
  };

  const showError = (text) => {
    if (successMessage) successMessage.style.display = "none";
    if (errorMessage) {
      errorMessage.textContent = text;
      errorMessage.style.display = "block";
    } else {
      console.warn("options.js: error ->", text);
    }
  };

  // Safe read: try chrome.storage first, otherwise localStorage
  try {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
      console.log("options.js: using chrome.storage.sync to load key");
      chrome.storage.sync.get(["geminiApiKey"], (result) => {
        console.log("options.js: chrome.storage.sync.get ->", result);
        if (result && result.geminiApiKey) {
          apiInput.value = result.geminiApiKey;
          console.log("options.js: loaded key (masked):", mask(result.geminiApiKey));
        }
      });
    } else {
      const v = localStorage.getItem("geminiApiKey");
      if (v) {
        apiInput.value = v;
        console.log("options.js: loaded key from localStorage (masked):", mask(v));
      } else {
        console.log("options.js: no saved key found in localStorage");
      }
    }
  } catch (err) {
    console.error("options.js: error reading storage:", err);
  }

  // Save handler with guards and logs
  saveButton.addEventListener("click", () => {
    const apiKey = apiInput.value.trim();
    if (!apiKey) {
      showError("Please enter an API key before saving.");
      return;
    }

    try {
      console.log("options.js: saving key (masked):", mask(apiKey));
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            console.error("options.js: chrome.storage.sync.set error:", chrome.runtime.lastError);
            showError("Failed to save settings: " + chrome.runtime.lastError.message);
            return;
          }
          console.log("options.js: chrome.storage.sync.set succeeded");
          showSuccess();
        });
      } else {
        localStorage.setItem("geminiApiKey", apiKey);
        console.log("options.js: saved key to localStorage (masked):", mask(apiKey));
        showSuccess();
      }
    } catch (err) {
      console.error("options.js: error saving key:", err);
      showError("Failed to save settings in this environment.");
    }
  });
});