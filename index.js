//EXPRESS - Okvir za manipulaciju rutama i serverima
const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
//Ručno postavljanje porta

require('dotenv').config();

app.use(cors());
app.use(express.json());
//Funkcija express okvira za analizu http zahtjeva
app.use(express.urlencoded());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(`/.netlify/functions/api`, authRoutes);
app.use('/auth', authRoutes);

module.exports = app;
module.exports.handler = serverless(app);