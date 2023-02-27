const mongoose = require ("mongoose");
async function main() {
    await mongoose
    .connect(config.database.mongoDBUrl)
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch((err) => {
        console.log(`Somthing in Mongo went worng ${err}`);
    })
}
mongoose.set('strictQuery', false);
main();