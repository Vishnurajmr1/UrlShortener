require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = process.env.PORT || 8001;

connectToMongoDB(process.env.MONGO_DB_URL).then(() =>
  console.log("Mongodb Connected")
);
app.use(express.json());
app.use("/url", urlRoute);
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
