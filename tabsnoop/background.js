// background.js

let activeTabId = null;
let activeTabUrl = null;
let tabSwitchTime = {}; // Stores the last activation time for each tabId

// Initialize tab tracking on extension startup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    activeTabId = tabs[0].id;
    activeTabUrl = tabs[0].url;
    tabSwitchTime[activeTabId] = Date.now();
  }
});

// Function to save tab time
async function saveTabTime(tabId, url) {
  if (!url || url.startsWith('chrome://') || url.startsWith('edge://')) {
    return; // Ignore internal Chrome/Edge pages
  }

  const now = Date.now();
  const startTime = tabSwitchTime[tabId];

  if (startTime) {
    const duration = now - startTime;
    const domain = getDomainFromUrl(url);

    if (domain) {
      // Fetch existing data
      const storedData = await chrome.storage.local.get(domain);
      const existingDomainData = storedData[domain] || { totalTime: 0, visits: [] };

      // Update total time and visits
      existingDomainData.totalTime += duration;
      existingDomainData.visits.push({ start: startTime, end: now });

      // Save updated data
      await chrome.storage.local.set({ [domain]: existingDomainData });
      console.log(`Saved ${duration}ms for ${domain}. Total: ${existingDomainData.totalTime}`);
    }
  }
  // Reset tabSwitchTime for the current tabId after saving
  delete tabSwitchTime[tabId];
}

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // If there was a previously active tab, save its time
  if (activeTabId !== null && activeTabUrl !== null) {
    await saveTabTime(activeTabId, activeTabUrl);
  }

  // Update active tab and set its new start time
  activeTabId = activeInfo.tabId;
  tabSwitchTime[activeTabId] = Date.now();

  // Get the URL of the newly active tab
  chrome.tabs.get(activeTabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting tab info:", chrome.runtime.lastError.message);
      activeTabUrl = null;
      return;
    }
    activeTabUrl = tab.url;
  });
});

// Listen for tab updates (e.g., navigation within the same tab)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only process if the tab is the currently active one and the URL has changed
  if (tabId === activeTabId && changeInfo.url && tab.active) {
    // Save time for the old URL before updating to the new one
    if (activeTabUrl !== null && activeTabUrl !== tab.url) {
      await saveTabTime(tabId, activeTabUrl);
    }
    activeTabUrl = tab.url;
    tabSwitchTime[tabId] = Date.now(); // Reset start time for the new URL
  }
});

// Listen for tab removal (tab closed)
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  // If the removed tab was the active one, save its time
  if (tabId === activeTabId && activeTabUrl !== null) {
    await saveTabTime(tabId, activeTabUrl);
    activeTabId = null; // No active tab after closure
    activeTabUrl = null;
  }
  // Also clean up tabSwitchTime for the removed tab
  delete tabSwitchTime[tabId];
});

// Handle window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // All windows unfocused (e.g., user locked screen or switched to another app)
    if (activeTabId !== null && activeTabUrl !== null) {
      await saveTabTime(activeTabId, activeTabUrl);
    }
    activeTabId = null;
    activeTabUrl = null;
  } else {
    // A window gained focus, find the active tab in it
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs[0]) {
        if (activeTabId !== null && activeTabUrl !== null && activeTabId !== tabs[0].id) {
          // If a different tab was previously active, save its time
          saveTabTime(activeTabId, activeTabUrl);
        }
        activeTabId = tabs[0].id;
        activeTabUrl = tabs[0].url;
        tabSwitchTime[activeTabId] = Date.now();
      }
    });
  }
});

// Idle time detection
let isIdle = false;
chrome.idle.setDetectionInterval(60); // Set detection interval to 60 seconds (1 minute)

chrome.idle.onStateChanged.addListener(async (newState) => {
  if (newState === "idle" || newState === "locked") {
    console.log("User is idle or locked.");
    isIdle = true;
    if (activeTabId !== null && activeTabUrl !== null) {
      await saveTabTime(activeTabId, activeTabUrl);
    }
    activeTabId = null; // No active tab during idle/locked state
    activeTabUrl = null;
  } else if (newState === "active" && isIdle) {
    console.log("User is active again.");
    isIdle = false;
    // When user becomes active again, re-initialize tracking for the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        activeTabId = tabs[0].id;
        activeTabUrl = tabs[0].url;
        tabSwitchTime[activeTabId] = Date.now();
      }
    });
  }
});

// Helper function to extract domain from URL (copied from utils.js)
function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' prefix for consistency if present
    const domain = urlObj.hostname.replace(/^www\./, '');
    return domain;
  } catch (e) {
    console.error("Invalid URL:", url);
    return null;
  }
}