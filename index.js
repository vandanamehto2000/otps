const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const db = require("./config/dbConfig");
db();

app.use("/", require("./routes/otpRoutes"));


const PORT = 8000;

app.listen(PORT, () => {
    console.log('Sever started at PORT', PORT);
});
