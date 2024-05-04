const dotenv = require('dotenv').config()
const mongoose = require('mongoose');


const MongoDB = dotenv.parsed.MONGO_DB;
//const MongoDB = process.env.MONGO_DB;

const connectDB = async () => {
    await mongoose.connect(MongoDB);

    if(mongoose.connection.readyState === 1){
        console.log("DB Connected");
    } else {
        console.log(mongoose.connection.readyState);
    }

}

module.exports = {
    connectDB,
    mongoose
}