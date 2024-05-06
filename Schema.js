const { mongoose } = require('./db');

const Schema = mongoose.Schema

const SignUpSchema = new Schema({
    username: { type: String },
    password: { type: String },
    phonenumber: { type: String },
    isAdminLogIn: { type: Boolean }
})

const ForgotPasswordSchema = new Schema({
    username: { type: String },
    otp: { type: String }
})


const SignUpModel = mongoose.model("SignUp", SignUpSchema);
const ForgotpasswordModel = mongoose.model("forgotpassword", ForgotPasswordSchema);

module.exports = {
    SignUpModel,
    ForgotpasswordModel
}