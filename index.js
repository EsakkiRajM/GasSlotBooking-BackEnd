const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const { SignUpModel } = require('./Schema');
const dotenv = require('dotenv').config();

const app = express();
const PORT = dotenv.parsed.PORT;

app.use(bodyParser.json());
app.use(cors());

connectDB();

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'My_Secret_key';

app.get("/", (req, res) => {
    res.send("Server working fine");
});

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

// app.get("/findUserName", async (req, res) => {
//     try {
//         const username = req.query.username;
//         const user = await SignUpModel.findOne({ username: username });

//         if (user) {
//             console.log(user.username); // Print username if found
//             res.status(200).json({ username: user.username }); // Send username as JSON response
//         } else {
//             console.log("User not found");
//             res.status(404).json({ error: "User not found" }); // Respond with error if user not found
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" }); // Handle internal server error
//     }
// });

app.get("/findUserName", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { username } = decoded;
    // Check if username exists in the database and send appropriate response
    const usernameExists = checkIfUsernameExists(username); // Replace with your function to check username existence

    return res.json({ exists: usernameExists });
  });
})


app.listen(PORT, () => {
    console.log("Server Started");
});
