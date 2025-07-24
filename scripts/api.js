export async function callBackend(mode, jobDescription = '', resumeText = '', userQuery = '', additionalContext = '', engine = 'gemini') {
    try {
        // The backend function is now a generic "ai-router"
        const backendUrl = `${window.location.origin}/.netlify/functions/gemini`; 
        
        const payload = {
            mode,
            jobDescription,
            resumeText,
            userQuery,
            additionalContext,
            engine // Pass the selected engine to the backend
        };

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Try to parse the error text as JSON, otherwise use the raw text
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || `API request failed: ${response.statusText}`);
            } catch (e) {
                throw new Error(errorText || `API request failed: ${response.statusText}`);
            }
        }
        return await response.text();

    } catch (error) {
        console.error("Backend call failed:", error);
        throw error;
    }
}
