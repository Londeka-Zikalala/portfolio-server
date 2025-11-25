function contactMe(db, emailService = null){
    //function to insert the details in the database
    async function sendMessage(username, userEmail, userMessage) {
        const timestamp = new Date(); 
        
        try {            
            // Insert message with timestamp
            await db.none(
                'INSERT INTO messages (name, email, message, created_at) VALUES ($1, $2, $3, $4)', 
                [username, userEmail, userMessage, timestamp]
            );
            
            // Send email notification 
            if (emailService) {
                emailService.sendContactNotification(username, userEmail, userMessage, timestamp)
                    .then(result => {
                        if (result.success) {
                            console.log('Email notification sent successfully');
                        } else {
                            console.warn('Email notification failed:', result.error);
                        }
                    })
                    .catch(err => {
                        console.error('Email notification error:', err);
                    });
            }
            
            return { success: true, timestamp };
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