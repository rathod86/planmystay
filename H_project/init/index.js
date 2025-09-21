const mongoose = require("mongoose");
const data = require ("./data.js").data;
const Listing = require("../models/listing.js");
const { matchMutation } = require("@tanstack/react-query");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to mongodb");
})

.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect (MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    console.log(data.filter(d => !d.title));
    await Listing.insertMany(data);
    console.log("data was initialized");
};

initDB();