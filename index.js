const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const { SignUpModel } = require('./Schema');
const dotenv = require('dotenv').config();
const bcryptjs = require('bcryptjs');

const app = express();
const PORT = dotenv.parsed.PORT;
//const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

connectDB();

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'My_Secret_key';

app.get("/", (req, res) => {
    res.send("Server working fine");
});

// console.log(process.env.MONGO_DB);
// console.log(process.env.PORT, "PORT");

app.post("/registration", async (req, res) => {
    try {
        const data = await SignUpModel.create({
            username: req.body.username,
            password: req.body.password,
            phonenumber: req.body.phonenumber,
        });
        console.log(data, "data");
        res.send(data);
    } catch (error) {
        console.error("Error occurred while registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/findUserName", async (req, res) => {
    try {
        const username = req.query.username;
        const user = await SignUpModel.findOne({ username: username });

        if (user) {
            console.log(user.username); // Print username if found
            res.status(200).json({ username: user.username, _id: user._id }); // Send username as JSON response
        } else {
            console.log("User not found");
            res.status(404).json({ error: "User not found" }); // Respond with error if user not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Handle internal server error
    }
});

app.get("/login", async (req, res) => {
    const { username, password } = req.query;

    try {
        const user = await SignUpModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(404).json({ message: "Incorrect password" });
        }

        res.status(200).json({ username: user.username, _id: user._id, password: isPasswordMatch });
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server Started");
});
