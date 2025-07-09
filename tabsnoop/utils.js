// utils.js

/**
 * Formats milliseconds into HH:MM:SS format.
 * @param {number} milliseconds - The time in milliseconds.
 * @returns {string} Formatted time string (HH:MM:SS).
 */
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Extracts the domain name from a given URL.
 * @param {string} url - The URL string.
 * @returns {string|null} The domain name or null if the URL is invalid.
 */
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

/**
 * Merges new visit data into existing data for a domain.
 * This function is primarily for conceptual completeness, as the background script handles
 * this directly during data saving.
 * @param {object} existingData - The existing data for a domain.
 * @param {object} newData - The new visit data.
 * @returns {object} The merged data.
 */
function mergeVisitData(existingData, newData) {
  const merged = { ...existingData };
  merged.totalTime = (merged.totalTime || 0) + (newData.totalTime || 0);
  merged.visits = (merged.visits || []).concat(newData.visits || []);
  return merged;
}