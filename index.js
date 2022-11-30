const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) =>{
    res.send('https://calm-sea-96817.herokuapp.com');
});

app.post('/', (req, res) =>{
    const { message, user: sender, type, members} = req.body;

    if(type === 'mesage.new'){
        members
            .filter((member) => members.user_id !== sender.id)
            .forEach(({ user }) =>{
                if(!user.online){
                    twilioClient.messages.create({
                       body: `Imate novu poruku od ${members.user.fullName} - ${message.text}`,
                       messagingServiceSid: messagingServiceSid,
                       to: user.phoneNumber 
                    })
                        .then(() => console.log('Poslali ste poruku!'))
                        .catch((err) => console.log(err));
                }
            })
            return res.status(200).send('Poslali ste poruku!');
    }
    return res.status(200).send('Nemate novih poruka.')
})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`server running on port ${PORT}`));