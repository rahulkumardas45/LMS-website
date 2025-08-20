import mongoose from "mongoose";

//connect too the mongodb database

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=> console.log('Database conected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
}

export default connectDB