// Keep-alive service for self-pinging
function createKeepAliveService() {
    function startKeepAlive(serverUrl, intervalMs = 43200000) {
        if (!serverUrl) {
            console.log('Keep-alive disabled. Set KEEP_ALIVE_URL to enable self-pinging.');
            return;
        }

        const hours = intervalMs / (1000 * 60 * 60);
        console.log(`Keep-alive enabled: pinging ${serverUrl}/ping every ${hours} hours`);

        // Ping immediately on startup
        fetch(`${serverUrl}/ping`)
            .then(() => console.log('Initial keep-alive ping successful'))
            .catch(err => console.warn('Initial keep-alive ping failed:', err.message));

        // Set up periodic pings
        setInterval(async () => {
            try {
                const response = await fetch(`${serverUrl}/ping`);
                if (response.ok) {
                    console.log(`Keep-alive ping successful at ${new Date().toISOString()}`);
                }
            } catch (error) {
                console.warn('Keep-alive ping failed:', error.message);
            }
        }, intervalMs);
    }

    return {
        startKeepAlive
    };
}

export default createKeepAliveService;

