const mongoose=require('mongoose')
// const mongoURI="mongodb://127.0.0.1:27017/notez?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
const mongoURI="mongodb+srv://rakshitajadoun7:GateCSERJ@cluster0.3whytps.mongodb.net/Notezdb?retryWrites=true&w=majority";
const connectToMongo=()=>{
    mongoose.connect(mongoURI)
    .then(()=>{
        console.log("Connected to Mongo Successfully.")
    })
}

module.exports=connectToMongo