const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { json } = require("react-router-dom");
const app = express();
const dayjs = require("dayjs");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "mess_organigation",
});

const baseUrl = "/maca/v1";

app.get(`${baseUrl}/borderlist`, (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      res.status(400).send({
        message: "An error occurred",
        status: 400,
        isSuccess: false,
        data: null,
      });
    } else if (result && result.length > 0) {
      res.status(200).send({
        message: "Data retrieved successfully",
        status: 200,
        isSuccess: true,
        data: result,
      });
      console.log("result");
    } else {
      res.status(404).send({
        message: "No data found",
        status: 404,
        isSuccess: false,
        data: [],
      });
    }
  });
});

app.listen(3000, () => {
  console.log("running server");
});
