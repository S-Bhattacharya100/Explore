const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../model/listing");

main()
    .then(() => {
        console.log("Mongodb connected successfully");
    })
    .catch((e) => {
        console.log(e);
    });
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const insertData = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "680b6566e67b2d129386a9a0"}));
    let insertData = await Listing.insertMany(initData.data);
    console.log(insertData);
}

insertData();