// dataService.js
// This service connects to the Google Apps Script Web App

// Replace this with the URL you get after deploying your Google Apps Script
export const GAS_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

export const dataService = {
  // Fetch all rows from a specific sheet/tab
  fetchData: async (sheetName) => {
    try {
      // If no URL is set, fallback to localStorage
      if (GAS_WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        return getLocalData(sheetName);
      }

      const response = await fetch(`${GAS_WEB_APP_URL}?action=read&sheet=${sheetName}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error(`Error fetching ${sheetName}:`, error);
      // Fallback to local storage if network fails
      return getLocalData(sheetName);
    }
  },

  // Add or update data in a specific sheet
  writeData: async (sheetName, payload) => {
    try {
      if (GAS_WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        return setLocalData(sheetName, payload);
      }

      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // Using text/plain prevents CORS preflight issues with GAS
        body: JSON.stringify({
          action: "write",
          sheet: sheetName,
          data: payload,
        }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Error writing to ${sheetName}:`, error);
      return setLocalData(sheetName, payload);
    }
  },

  // Delete a specific row by ID (assuming each row has an 'id' column)
  deleteData: async (sheetName, id) => {
    try {
      if (GAS_WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        return deleteLocalData(sheetName, id);
      }

      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "delete",
          sheet: sheetName,
          id: id,
        }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Error deleting from ${sheetName}:`, error);
      return deleteLocalData(sheetName, id);
    }
  }
};

// ==========================================
// LOCAL STORAGE FALLBACKS
// ==========================================
const getLocalData = (sheetName) => {
  const data = localStorage.getItem(`ieee_${sheetName}`);
  return data ? JSON.parse(data) : [];
};

const setLocalData = (sheetName, payload) => {
  // If payload is an array, we overwrite the whole sheet. If it's an object, we append/update it.
  let currentData = getLocalData(sheetName);
  
  if (Array.isArray(payload)) {
    currentData = payload;
  } else {
    const existingIndex = currentData.findIndex(item => item.id === payload.id);
    if (existingIndex >= 0) {
      currentData[existingIndex] = payload;
    } else {
      currentData.push(payload);
    }
  }
  
  localStorage.setItem(`ieee_${sheetName}`, JSON.stringify(currentData));
  return true;
};

const deleteLocalData = (sheetName, id) => {
  let currentData = getLocalData(sheetName);
  currentData = currentData.filter(item => item.id !== id);
  localStorage.setItem(`ieee_${sheetName}`, JSON.stringify(currentData));
  return true;
};
