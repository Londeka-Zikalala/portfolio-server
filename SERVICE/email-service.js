import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

//Email service for sending notifications via Gmail

function createEmailService() {
    const recipientEmail = process.env.RECIPIENT_EMAIL;
    const senderEmail = process.env.SENDER_EMAIL || recipientEmail;
    const senderName = process.env.SENDER_NAME || 'Portfolio Contact Form';
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    // Check if email service is configured
    if (!recipientEmail || !gmailUser || !gmailAppPassword) {
        console.warn('Warning: Gmail email service not fully configured. Email notifications will be disabled.');
        console.warn('Required: RECIPIENT_EMAIL, GMAIL_USER, GMAIL_APP_PASSWORD');
        return {
            sendContactNotification: async () => {
                console.log('Email service disabled - Gmail not configured');
                return { success: true, skipped: true };
            }
        };
    }

    // Gmail configuration 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailAppPassword, 
        },
    });
// send email notification 
    async function sendContactNotification(username, userEmail, userMessage, timestamp) {
        try {
            const formattedDate = new Date(timestamp).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'long',
                timeZone: 'UTC'
            });

            const mailOptions = {
                from: `"${senderName}" <${senderEmail}>`,
                to: recipientEmail,
                // Subject includes [Portfolio Request] for easy Gmail filtering
                subject: `[Portfolio Request] ${username} (${userEmail})`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                            .field { margin-bottom: 15px; }
                            .label { font-weight: bold; color: #555; }
                            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #4CAF50; }
                            .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #777; text-align: center; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2>New Portfolio Contact Form Submission</h2>
                            </div>
                            <div class="content">
                                <div class="field">
                                    <div class="label">From:</div>
                                    <div class="value">${username} &lt;${userEmail}&gt;</div>
                                </div>
                                <div class="field">
                                    <div class="label">Submitted:</div>
                                    <div class="value">${formattedDate}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Message:</div>
                                    <div class="value">${userMessage.replace(/\n/g, '<br>')}</div>
                                </div>
                            </div>
                            <div class="footer">
                                <p>This email was automatically generated from your portfolio contact form.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
New Portfolio Contact Form Submission

From: ${username} <${userEmail}>
Submitted: ${formattedDate}

Message:
${userMessage}
                `.trim(),
                // Headers to help organize emails into folders
                headers: {
                    'X-Priority': '1', 
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high',
                    'X-Mailer': 'Portfolio Contact Form',
                    // Custom header for filtering (Gmail/Outlook can filter on this)
                    'X-Portfolio-Request': 'true',
                },
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email notification sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email notification:', error);
            // Don't throw - email failure shouldn't break the contact form
            return { success: false, error: error.message };
        }
    }

    return {
        sendContactNotification
    };
}

export default createEmailService;
