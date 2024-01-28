function contactMe(db){
    //function to insert the details in the database
    async function sendMessage(username, userEmail, userMessage) {
        try {
            await db.none(`INSERT INTO messages (name, email, message) VALUES ($1,$2,$3)`,[username,userEmail,userMessage])
            return 'Message sent successfully!'
        } catch (error) {
            console.error(error.message)
        }

    }
    return{
        sendMessage
    }
}

export default contactMe