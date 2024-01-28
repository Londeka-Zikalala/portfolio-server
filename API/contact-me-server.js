function contactMeAPI(contactMeDb){
    async function postMessage(req, res) {
        try {
            const username = req.body.name;
            const userEmail = req.body.email;
            const userMessage = req.body.message;
        
           
            // Regex for validating an email address
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(userEmail)) {
            return res.json({ status: 'error', message: 'Invalid email format' });
            }
            //check if fields are filled
            if (userEmail === "" || userMessage === "" || username === "") {
                return res.json({ status: 'error', message: 'Please fill all fields' });

        }
        //send the message
        await contactMeDb.sendMessage(username,userEmail,userMessage);
        res.json({ status: 'success', message: 'message sent!' });

        } catch (error) {
            res.json({ status: 'error', error: error.stack });
        }
    }

    return {
        postMessage
    }

}

export default contactMeAPI