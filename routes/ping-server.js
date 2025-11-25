// Ping endpoint for keep-alive
function pingAPI() {
    function ping(req, res) {
        res.status(200).json({ 
            status: 'pong', 
            timestamp: new Date().toISOString() 
        });
    }

    return {
        ping
    };
}

export default pingAPI;

