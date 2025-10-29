// Simple article extractor (kept minimal)
function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  // fallback: gather paragraphs
  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

console.log("content.js: injected and running on", location.href);

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log("content.js: received message ->", req, "from", sender);
  if (req && req.type === "GET_ARTICLE_TEXT") {
    const text = getArticleText();
    console.log("content.js: extracted text length ->", text && text.length);
    sendResponse({ text });
  }
  // returning false keeps the message channel open only if needed; we sendResponse synchronously
  return false;
});