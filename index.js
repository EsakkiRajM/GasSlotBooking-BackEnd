const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const { SignUpModel, ForgotpasswordModel, CreateBookingModel  } = require('./Schema');
const dotenv = require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { v4: uuid } = require('uuid');
//const nodemailer = require("nodemailer");


const app = express();
//const PORT = dotenv.parsed.PORT;
const PORT = process.env.PORT;
// const email = process.env.EMAIL
// const pass = process.env.PASS

app.use(bodyParser.json());
app.use(cors());

connectDB();

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'My_Secret_key';

const auth = (req, res, next) => {
    if (req.body.username || req.query.username) {
        next();
    } else {
        res.send("API ERROR")
        console.log(req.body.username, req.query.username)
    }
}

app.use(auth);

app.get("/", (req, res) => {
    res.send("Server working fine");
    //console.log(req.body.username, req.query.username)
});

// console.log(process.env.MONGO_DB);
// console.log(process.env.PORT, "PORT");

app.post("/registration", async (req, res) => {
    try {
        const data = await SignUpModel.create({
            username: req.body.username,
            password: req.body.password,
            phonenumber: req.body.phonenumber,
            isAdminLogIn: false
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
        console.log(user);
        res.status(200).json({
            username: user.username, _id: user._id, password: isPasswordMatch, isAdminLogIn: user.isAdminLogIn,
            phonenumber: user.phonenumber
        });
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// FindExist User and send OTP

app.get("/findExistUser", async (req, res) => {
    try {
        const username = req.query.username;
        const user = await SignUpModel.findOne({ username: username });
        const OTP = uuid();
        //console.log(typeof OTP);
        const digitOTP = OTP.slice(0, 6);
        console.log(digitOTP);
        if (user) {
            const forgotPasswordRes = await ForgotpasswordModel.create({
                username: user.username,
                otp: digitOTP
            })
            console.log(user.username); // Print username if found
            res.status(200).json({
                username: user.username,
                _id: user._id,
                OTP: digitOTP,
                OTP_id: forgotPasswordRes._id
            }); // Send username as JSON response
            console.log(forgotPasswordRes, "forgotPasswordRes");
            // nodemailer start
            // if (forgotPasswordRes?._id) {
            //     async function sendEmail() {
            //       const transporter = nodemailer.createTransport({
            //         host: "smtp.ethereal.email",
            //         port: 587,
            //         secure: false, // Use `true` for port 465, `false` for all other ports
            //         auth: {
            //           user: email,
            //           pass: pass,
            //         },
            //       });

            //       try {
            //         // Send mail with defined transport object
            //         const info = await transporter.sendMail({
            //           from: '"Esakki" <esakki2023@gmail.com>',
            //           to: "raja@gmail.com",
            //           subject: "Hello ✔",
            //           text: "Hello world?",
            //           html: "<b>Hello world?</b>",
            //         });

            //         console.log("Message sent: %s", info.messageId);
            //         // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
            //       } catch (error) {
            //         console.error("Error sending email:", error);
            //       }
            //     }

            //     // Call the function to send the email
            //     sendEmail();
            //   }

            // // nodemailer end
        } else {
            console.log("User not found");
            res.status(404).json({ error: "User not found" }); // Respond with error if user not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Handle internal server error
    }
});

//Submit OTP

app.get("/submitOTP", async (req, res) => {
    const { username, otp } = req.query;

    try {
        const user = await ForgotpasswordModel.findOne({ username, otp });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        res.status(200).json({ username: user.username, otp: user.otp });
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// change password

app.patch("/changePassword", async (req, res) => {
    const { username, password } = req.query;

    try {
        const user = await SignUpModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        // Hash the new password
        //const hashedNewPassword = await bcryptjs.hash(password, 0);

        // Update the user's password in the database
        const changePasswordRes = await SignUpModel.updateOne({ _id: user._id }, { password: password });

        console.log(changePasswordRes, "changePasswordRes");

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error occurred while updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create Booking

app.post("/createBooking", async (req, res) => {
    const username  = req.query.username;
    try {
        const data = await CreateBookingModel.create({
            firstName: req.body.firstname,
            lastName: req.body.lastName,
            email: req.body.email,
            addressOne: req.body.addressOne,
            addressTwo: req.body.addressTwo,
            phoneNumber: req.body.phoneNumber,
            pinCode: req.body.pinCode,
            gasProviderName:req.body.gasProviderName,
            signUpId: req.body._id
        });
        console.log(data, "data");
        res.status(200).json({ message: "Booking created successfully" });
        //res.send(data);
    } catch (error) {
        console.error("Error occurred while registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});




app.listen(PORT, () => {
    console.log("Server Started");
});
