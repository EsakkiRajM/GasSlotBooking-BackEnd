const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');
const { connectDB } = require('./db');

const dotenv = require('dotenv').config()

const PORT = dotenv.parsed.PORT;

app.use(bodyParser.json());

app.use(cors());

connectDB();

app.get("/", (req, res) => {
    res.send("Server working fine")
})

app.listen(PORT, () => {
    console.log("Server Started");
}) 