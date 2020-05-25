const express = require("express");
const app = express();
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { readHtmlFile } = require("./scraper");

dotenv.config();

// connect to mongodb
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to mongodb")
);

app.get("/scrape", async (req, res) => {
  //   const url = "http://gormahiafc.co.ke";

  try {
    readHtmlFile("gor.html");
  } catch (error) {
    res.json(error);
  }
});

app.listen(5000, () => {
  console.log("scraper started");
});
