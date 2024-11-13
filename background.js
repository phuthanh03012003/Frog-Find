// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "summarizeContent") {
      const summary = await fetchSummary(message.content);
      sendResponse({ summary });
    } else if (message.type === "keywordSearch") {
      const result = await fetchKeywordInfo(message.content, message.keyword);
      sendResponse({ result });
    }
    return true;
  });
  
  // Fetch summary from Claude API
  async function fetchSummary(content) {
    const response = await fetch("https://claude.api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_API_KEY`
      },
      body: JSON.stringify({ prompt: `Summarize: ${content}` })
    });
    const data = await response.json();
    return data.summary;
  }
  
  // Fetch keyword information from Claude API
  async function fetchKeywordInfo(content, keyword) {
    const response = await fetch("https://claude.api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_API_KEY`
      },
      body: JSON.stringify({ prompt: `Find details about "${keyword}" in the context: ${content}` })
    });
    const data = await response.json();
    return data.result;
  }
  