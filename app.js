const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { json } = require("react-router-dom");
const app = express();
const dayjs = require("dayjs");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

var parser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "mess_organigation",
});

const baseUrl = "/maca/v1";

const responseReturn = (res, result, err) => {
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
};

app.get(`${baseUrl}/borderlist`, (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    responseReturn(res, result, err); // Pass `res` as the first argument
  });
});

app.post(`${baseUrl}/user_marketing`, (req, res) => {
  let marketing_amount = req.body.marketing_amount;
  let user_id = req.body.user_id;
  let created_date = new Date();

  db.query(
    "INSERT INTO user_marketig_master(marketing_amount,user_id,created_date) values(?,?,?)",
    [marketing_amount, user_id, created_date],
    (err, result, field) => {
      if (err) {
        return res.send({ success: false, message: "somthing is wrong...." });
      } else {
        db.query("select * from user_marketig_master", (err, result, feild) => {
          responseReturn(res, result, err);
        });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("running server");
});
