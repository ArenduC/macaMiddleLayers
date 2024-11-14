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
  } else if (result) {
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

app.post(`${baseUrl}/user_deposite`, (req, res) => {
  console.log("Request Body:", req.body);
  let user_id = req.body.user_id;
  let manager_id = req.body.manager_id;
  let user_deposite_amount = req.body.user_deposite_amount;
  let user_deposite_date = new Date();

  db.query(
    "INSERT INTO user_deposite_master(user_id, manager_id, user_deposite_amount, user_deposite_date) values(?,?,?,?)",
    [user_id, manager_id, user_deposite_amount, user_deposite_date],
    (err, result, field) => {
      responseReturn(res, result, err);
    }
  );
});

app.post(`${baseUrl}/electric_bill`, (req, res) => {
  console.log("Request Body:", req.body);
  let electric_bill = req.body.electric_bill;
  let manager_id = req.body.manager_id;
  let electric_unit = req.body.electric_unit;
  let internet_bill = req.body.internet_bill;
  let created_date = new Date();

  db.query(
    "INSERT INTO maca_electric_bill(manager_id, electric_bill, electric_unit, internet_bill, created_date) values(?,?,?,?,?)",
    [manager_id, electric_bill, electric_unit, internet_bill, created_date],
    (err, result, field) => {
      responseReturn(res, result, err);
    }
  );
});

app.listen(3000, () => {
  console.log("running server");
});
