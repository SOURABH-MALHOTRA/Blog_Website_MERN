const express = require("express");
const cors = require("cors");
const path = require("path");
const useRouter = require("./Router/router.js");
const { connectToMongoDB } = require("./connect");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT;
const ConnectionUrl = process.env.CONNECTION_URL;
const FrontendUrl = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FrontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/Uploads", express.static("Uploads"));
app.use("/login", useRouter);

module.exports = app;


if (process.env.NODE_ENV !== 'vercel') {
  connectToMongoDB(ConnectionUrl)
    .then((data) => {
      console.log(`DB connected with server: ${data.connection.host}`);
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}