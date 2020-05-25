const express = require("express");
const fs = require("fs");
const cheerio = require("cheerio");
const app = express();
const axios = require("axios");

const { createFile, createContent, readHtmlFile } = require("./scraper");

// app.get("/scrape", async (req, res) => {
//   const url = "http://gormahiafc.co.ke";

//   try {
//     const { data: html } = await axios.get(url);
//     const $ = cheerio.load(html);

//     // createfile
//     createFile(html);

//     //create content
//     createContent($);

//     // res.send($);
//   } catch (error) {
//     res.json(error);
//   }
// });

(function (filepath) {
  readHtmlFile(filepath);
})("gor.html");

// app.listen(5000, () => {
//   console.log("scraper started");
// });
