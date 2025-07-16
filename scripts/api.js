// START: Updated function signature to include additionalContext
export async function callBackend(mode, jobDescription = '', resumeText = '', userQuery = '', additionalContext = '') {
// END: Updated function signature
    try {
        const backendUrl = `${window.location.origin}/.netlify/functions/gemini`;
        const payload = {
            mode,
            jobDescription,
            resumeText,
            userQuery,
            // START: Add additionalContext to payload
            additionalContext
            // END: Add additionalContext to payload
        };

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return await response.text();

    } catch (error) {
        console.error("Backend call failed:", error);
        throw error;
    }
}
