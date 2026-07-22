const Resend = require('resend');
const config = require('../config/config');

const resend = new Resend(config.RESEND_API_KEY);


async function sendEmail(to,subject, text, html){
    try{
        await resend.emails.send({
        from: "auth@yourdomain.com",
        to,
        subject,
        text,
        html
        });

        console.log("Email sent successfully");
    } catch(err){
        console.log("Error sending email", err);
    }
}

module.exports = sendEmail;