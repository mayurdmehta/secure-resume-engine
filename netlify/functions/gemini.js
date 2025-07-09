// This is a minimal test function to diagnose the root cause.
// It contains no large objects or complex logic.

exports.handler = async function (event, context) {
    try {
        // Immediately return a success message.
        return {
            statusCode: 200,
            body: "Isolation Test Successful! The basic function is running correctly."
        };
    } catch (error) {
        // This part should not be reached in this test.
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An internal error occurred in the test function.' }),
        };
    }
};
