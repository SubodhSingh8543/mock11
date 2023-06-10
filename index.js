const express = require("express");
const { connect } = require("./db");
const { authRoutes } = require("./routes/authRoutes");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());
app.use("/api",authRoutes);
app.listen(process.env.port, async () => {
    try {
        await connect;
        console.log("connected to db");
    } catch (error) {
        console.log("disconnected from  db");
    }
})