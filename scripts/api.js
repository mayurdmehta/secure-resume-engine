export async function callBackend(mode, jobDescription = '', resumeText = '', userQuery = '') {
    try {
        const backendUrl = `${window.location.origin}/.netlify/functions/gemini`;
        const payload = {
            mode,
            jobDescription,
            resumeText,
            userQuery
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