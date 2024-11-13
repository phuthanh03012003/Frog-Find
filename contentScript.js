// Extracts text content from the webpage and sends it to the popup
function extractTextContent() {
    const bodyText = document.body.innerText;
    chrome.runtime.sendMessage({ type: "extractedContent", content: bodyText });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "highlightKeyword") {
        highlightKeywordOnPage(message.keyword);
    }
});

// Improved highlight function to only highlight visible text nodes
function highlightKeywordOnPage(keyword) {
    if (!keyword) return;

    const markText = (node, keyword) => {
        const regex = new RegExp(`(${keyword})`, "gi");
        const newNode = document.createElement("span");
        
        newNode.innerHTML = node.textContent.replace(regex, '<mark>$1</mark>');
        node.replaceWith(newNode);
    };

    const walkDOM = (node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            markText(node, keyword);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of Array.from(node.childNodes)) {
                walkDOM(child);
            }
        }
    };

    walkDOM(document.body);
}

// Initial extraction of text content when the content script is loaded
extractTextContent();
