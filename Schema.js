const { mongoose } = require('./db');

const Schema = mongoose.Schema

const SignUpSchema = new Schema({
    username: { type: String },
    password: { type: String },
    phonenumber: { type: String }
})

const SignUpModel = mongoose.model("SignUp", SignUpSchema);

module.exports = {
    SignUpModel 
}