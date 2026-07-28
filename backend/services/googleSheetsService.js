import axios from "axios";

// Replace this with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw0AKBv4bRtGeHRE7h122uc2IQk58lWLDb-reqMDiO9WZWy_85ZUZBd3oZTErSlQfxa/exec";

/**
 * Send data to Google Sheets
 *
 * @param {string} sheetName
 * @param {object} data
 */
export const sendToGoogleSheet = async (sheetName, data) => {
    try {
        const payload = {
            sheetName,
            ...data,
        };

        const response = await axios.post(GOOGLE_SCRIPT_URL, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Google Sheet Response:", response.data);

        return response.data;
    } catch (error) {
        console.error(
            "Google Sheet Error:",
            error.response?.data || error.message
        );
    }
};