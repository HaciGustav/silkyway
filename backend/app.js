const express = require("express");
const app = express();
const cors = require("cors");

const userRoute = require("./src/routes/user.routes");
const { connectDB } = require("./src/config/db");

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/ `);
});
