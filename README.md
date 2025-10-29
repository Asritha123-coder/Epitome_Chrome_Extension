# AI Summary for Articles — Chrome Extension

A lightweight Chrome extension that extracts article text from the active tab and generates an AI-powered summary using Google's Generative Language (Gemini) API.

This README explains what the extension does, how to install and test it locally, and how to debug common problems (including the specific errors encountered while developing the project).

## Project structure

- `manifest.json` — MV3 manifest describing permissions, content scripts, background worker (`background.js`), and options page.
- `popup.html` / `popup.js` — The extension popup UI where the user chooses a summary type, requests a summary, and copies results.
- `content.js` — Content script injected into web pages; it extracts article text and replies to messages from the popup.
- `options.html` / `options.js` — Options page to enter/store the Gemini API key (uses `chrome.storage.sync` with a `localStorage` fallback in development).
- `background.js` — Service worker (background script) that opens the options page on install if the API key is not set.


## What it does

- Injects `content.js` into matching pages to extract page text (article tag or paragraphs fallback).
- The user opens the extension popup, chooses a summary type (brief, detailed, bullets), and clicks `Summarize This Page`.
- The popup requests the article text from the content script via `chrome.tabs.sendMessage`.
- The popup sends a request to the Gemini API (`generativelanguage.googleapis.com`) with the stored API key and displays the returned summary.


## Quick install (local development)

1. Open Chrome (or Chromium-based browser).
2. Go to `chrome://extensions/` and enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this repository folder (`summarizer chrome extension`).
4. After loading, you may want to click the extension's Details -> Options to add your Gemini API key.
   - Alternatively: Install then open the extension popup and follow prompts.


## Usage

- Click the extension icon to open the popup.
- Choose a summary type and click "Summarize This Page" on a page with an article.
- Click "Copy Summary" to copy result to clipboard.


## Required configuration

- A Gemini API key is required. Add it via the options page (Options -> enter key -> Save Settings).
- The extension uses `chrome.storage.sync` to store the key in the browser profile; during development the code falls back to `localStorage` when the Chrome storage API is not available.


## Debugging & troubleshooting

This project includes extra console logging to help debug common issues. Open DevTools for the popup (right-click in the popup -> Inspect) and the page you are summarizing (F12) to view logs.

Common problems and fixes observed during development:

1) "Uncaught TypeError: Cannot read properties of undefined (reading 'sync')" in `options.js`
- Cause: code attempted to use `chrome.storage.sync` in contexts where `chrome` or `chrome.storage` is undefined (for example, opening `options.html` directly in the browser as a file or non-extension context).
- Fixes implemented:
  - `options.js` now guards access to `chrome.storage.sync` and falls back to `localStorage` with console logs.
  - Always open options via the extension UI (chrome://extensions -> Details -> Options) to ensure extension APIs are available.

2) "Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist." when popup tries to `sendMessage`
- Cause: The content script wasn't present in the target tab. This can happen if:
  - The page type does not allow content scripts (e.g., `chrome://` pages, `file://` without `--allow-file-access-from-files`, PDFs or some special viewers).
  - The content script failed to load or was not injected for that tab.
- Fixes implemented:
  - `content.js` now logs on injection and when it receives messages so you can confirm the script is running on the page console.
  - `popup.js` now detects `chrome.runtime.lastError` after `sendMessage` and will attempt a one-time injection of `content.js` into the active tab using `chrome.scripting.executeScript` (MV3) and then retry the message once.
- Debugging steps:
  - Make sure you're testing on a regular `https://` web article page.
  - Open the page's DevTools console and look for `content.js: injected and running on ...` or message logs.
  - If injection is blocked, try a different page or reload the tab.

3) "failed to fetch" when calling Gemini API
- Cause: Could be a network problem, invalid API key, CORS issues, endpoint/path or query key parameter incorrect, or the API endpoint expecting a different payload/headers.
- Tips to debug:
  - Check the popup DevTools console for the exact fetch error (network offline, DNS, or CORS).
  - Verify that the stored API key is correct and active. In the popup console you will see a masked API key log when the key is read.
  - Verify the endpoint and request payload. The project attempts to use the Generative Language API and encodes the key as a URL parameter.
  - From a development perspective, you can try the same request in curl/postman to ensure the key and endpoint are working.


## Developer notes

- Manifest (MV3) requires `permissions` such as `scripting`, `activeTab`, and `storage`. `host_permissions` includes `<all_urls>` so the content script can run across pages. If you restrict `matches` or `host_permissions`, update accordingly.
- `background.js` uses `chrome.runtime.onInstalled` to open `options.html` if the API key isn't set.
- `content.js` contains a minimal extractor; you can replace it with a more robust parser (e.g., Mozilla Readability) if you want better article extraction.


## Testing suggestions

- Verify options saving:
  - Open Options page via extension UI and enter an API key.
  - Open the Console in Options DevTools to watch logs about saving/loading.
  - Verify `chrome.storage.sync.get` via the console: `chrome.storage.sync.get(['geminiApiKey'], console.log)`

- Verify content script and message flow:
  - Open a normal article page and its DevTools console. Look for `content.js: injected and running on ...` when page loads or after injection.
  - Open popup DevTools (inspect popup) and click Summarize — observe the logs about sending/receiving the GET_ARTICLE_TEXT message.

- Verify API call:
  - After content script returns text, the popup will call the Gemini API. Check popup console for fetch errors and returned responses.


## Next improvements (suggestions)

- Add a "Test API Key" button in Options that calls a small endpoint to verify the key immediately.
- Improve content extraction using Readability for better-quality summaries.
- Add retry/backoff for API calls and better error text for specific API errors returned by Gemini.
- Add a small E2E test harness / automated smoke tests for injection and storage behaviors.


## Contributing

PRs welcome. If you add features, please:
- Keep the extension MV3-compatible.
- Add tests where appropriate and document any new dependencies.


## License

Choose a license for your project (e.g., MIT). This repository currently has no license file — add one if you plan to publish the code.


---

If you'd like, I can also:
- Create this `README.md` file in the repository now (I can add it directly).
- Add a small `TESTING.md` with step-by-step console commands and exact expected logs for easier dev onboarding.

Tell me if you want me to create the README file in the repo now or adjust any wording/sections.