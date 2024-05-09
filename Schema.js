const { mongoose } = require('./db');
//const { ObjectId } = mongoose.Types; // Import ObjectId from Mongoose
//const ObjectId = Schema.Types.ObjectId;

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

const CreateBooking = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    addressOne: { type: String },
    addressTwo: { type: String },
    phoneNumber: { type: String },
    pinCode: { type: Number },
    gasProviderName: { type: String },
    //signUpId: { type: Array }
    //signUpId: [{ type: ObjectId, ref: 'SignUpModel' }] 
    signUpId: { type: mongoose.Schema.Types.ObjectId, ref: 'SignUpModel' },
    DateTime: { type: String }
})


const SignUpModel = mongoose.model("SignUp", SignUpSchema);
const ForgotpasswordModel = mongoose.model("forgotpassword", ForgotPasswordSchema);
const CreateBookingModel = mongoose.model("createbooking", CreateBooking);

module.exports = {
    SignUpModel,
    ForgotpasswordModel,
    CreateBookingModel, 
}