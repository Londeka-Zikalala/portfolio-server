function contactMeAPI(contactMeDb){
    // Optimized email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Input sanitization helper
    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        return str.trim();
    }

    async function postMessage(req, res) {
        try {
            // Extract and sanitize inputs
            const username = sanitizeInput(req.body.name);
            const userEmail = sanitizeInput(req.body.email);
            const userMessage = sanitizeInput(req.body.message);
        
            // Validate required fields (fast validation, early return)
            if (!username || !userEmail || !userMessage) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Please fill all fields' 
                });
            }

            // Validate email format
            if (!emailRegex.test(userEmail)) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Invalid email format' 
                });
            }

            // Validate input lengths to prevent abuse
            if (username.length > 255 || userEmail.length > 255) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Name or email is too long' 
                });
            }

            if (userMessage.length > 5000) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Message is too long (max 5000 characters)' 
                });
            }

            // Send the message
            await contactMeDb.sendMessage(username, userEmail, userMessage);
            
            // Success response with proper status code
            res.status(201).json({ 
                status: 'success', 
                message: 'Message sent successfully!' 
            });

        } catch (error) {
            console.error('Contact form error:', error);
            
            // Don't expose internal error details in production
            const errorMessage = process.env.NODE_ENV === 'production'
                ? 'Failed to send message. Please try again later.'
                : error.message;
            
            res.status(500).json({ 
                status: 'error', 
                message: errorMessage 
            });
        }
    }

    return {
        postMessage
    }
}

export default contactMeAPI