function contactMe(db){
    //function to insert the details in the database
    async function sendMessage(username, userEmail, userMessage) {
        try {
            console.log('contactMe.sendMessage - inserting message', { username, userEmail });
            await db.none('INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)', [username, userEmail, userMessage]);
            return { success: true };
        } catch (error) {
            console.error('contactMe.sendMessage - DB error:', error && error.message ? error.message : error);
            throw error;
        }

    }
    return{
        sendMessage
    }
}

export default contactMe