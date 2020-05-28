const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ClubArticles = require("./models/Article");

const { readHtmlFile, createContent, extractArticles } = require("./scraper");

dotenv.config();

// connect to mongodb
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to mongodb")
);

// app.get("/scrape", async (req, res) => {
//   //   const url = "http://gormahiafc.co.ke";

//   try {
//     readHtmlFile("gor.html");
//   } catch (error) {
//     res.json(error);
//   }
// });

(async () => {
  const firstUrl = "http://gormahiafc.co.ke/category/news/page/32/";

  try {
    // parse html and extract data
    const articles = await extractArticles(firstUrl);

    // add to mongodb
    // const bulkAdd = await ClubArticles.insertMany(articles);
    console.log("Articles", articles);
  } catch (error) {
    console.log(error);
  }
})();

app.listen(5000, () => {
  console.log("scraper started");
});
