const app = require("./app");
const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URL);
    console.log("Connected to DB successfully.");
    app.listen(process.env.SERVER_PORT, async () => {
      console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

module.exports = app;
