document.getElementById("search").addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value;
    const result = await searchKeyword(keyword);
    document.getElementById("result").textContent = result;
  });
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "highlightKeyword", keyword: keyword });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "extractedContent") {
      summarizeContent(message.content);
    }
  });
  
  async function summarizeContent(content) {
    const response = await chrome.runtime.sendMessage({
      type: "summarizeContent",
      content: content
    });
    document.getElementById("summary").textContent = response.summary;
  }
  
  async function searchKeyword(keyword) {
    const content = document.getElementById("summary").textContent;
    const response = await chrome.runtime.sendMessage({
      type: "keywordSearch",
      content: content,
      keyword: keyword
    });
    return response.result;
  }
  