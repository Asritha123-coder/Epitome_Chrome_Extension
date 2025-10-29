# 🧠 EPITOME – AI-Powered Text Summarizer Chrome Extension

**Epitome** is a lightweight Chrome extension that extracts the text of an article from the active tab and generates an **AI-powered summary** using **Google’s Generative Language (Gemini) API**.  
It provides quick **Brief**, **Detailed**, or **Bullet-point** summaries — all directly from the popup interface.

---

## ✨ Key Features

- 📰 **Summarize the active page** in three modes:
  - **Brief** – short summary  
  - **Detailed** – in-depth version  
  - **Bulleted** – key points list  
- 📋 **Copy summary to clipboard** directly from the popup  
- ⚙️ **Options page** to save your **Gemini API key**  
  - Uses `chrome.storage.sync` with a `localStorage` fallback for development  
- 🔄 **Automatic content-script injection fallback** if it wasn’t preloaded into the page  
- 🧑‍💻 **Developer-friendly console logs** for debugging:
  - Storage handling  
  - Messaging flow  
  - API errors  

---

## ⚙️ How It Works (High Level)

1. **`content.js`** runs in web pages and extracts the main article text  
   - Uses `<article>` tag or paragraph fallback if missing  
2. User opens the **popup (`popup.html`)**  
   - Selects a summary type  
   - Clicks **“Summarize This Page”**  
3. The popup requests the article text from the active tab via `chrome.tabs.sendMessage`  
4. If no response, the popup **injects `content.js`** dynamically and retries once  
5. The extracted text is sent to the **Gemini API** using the stored API key  
6. The **summary result** (brief/detailed/bulleted) is displayed instantly in the popup  
7. The **API key** is managed through `options.html` and persisted via `chrome.storage.sync`

---

## 🧩 Tech Stack

| Component | Description |
|------------|-------------|
| **Chrome Extension Manifest** | Manifest V3 |
| **Programming Language** | JavaScript (Vanilla) |
| **Frontend Files** | HTML, CSS, JavaScript |
| **Popup Interface** | `popup.html`, `popup.js` |
| **Content Script** | `content.js` for extracting text from web pages |
| **Options Page** | `options.html`, `options.js` for API key management |
| **Background Service Worker** | Handles messaging, API calls, and fallback logic |
| **Browser APIs Used** | `chrome.storage.sync`, `chrome.tabs`, `chrome.scripting`, `chrome.runtime`, `chrome.action` |
| **AI Model** | Google Gemini (Generative Language) API |
| **Storage Mechanism** | `chrome.storage.sync` with `localStorage` fallback |
| **Libraries** | None (simple DOM-based extraction) |
| **Optional Enhancement** | Can integrate Mozilla’s Readability.js for improved text extraction |

---

## 🚀 Setup Instructions

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/epitome.git
