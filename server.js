const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ClubArticles = require("./models/Article");
const chalk = require("chalk");

const {
  readHtmlFile,
  writeFileToJSon,
  extractArticles,
  extractYouthArticles,
  extractVideos,
} = require("./scraper");

dotenv.config();

// connect to mongodb
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to mongodb")
);

// app.get("/scrape", async (req, res) => {
//   const firstUrl = "http://gormahiafc.co.ke/category/news/page/32/";

//   try {
//     // parse html and extract data
//     const articles = await extractArticles(firstUrl);
//     // add to mongodb
//     const bulkAdd = await ClubArticles.insertMany(articles);
//     // console.log("Articles", articles);

//     // TODO end scrapping automagically
//   } catch (error) {
//     console.log(error);
//   }
// });

(async () => {
  const firstUrl = "http://gormahiafc.co.ke/category/news/page/1/";
  const youthUrl = "http://gormahiafc.co.ke/category/youth-team/";
  const videoUrl = "http://gormahiafc.co.ke/";
  const history = "http://gormahiafc.co.ke/category/history/";
  const gallery = "http://gormahiafc.co.ke/category/gallery/";

  try {
    // parse html and extract data for news
    // const articles = await extractArticles(firstUrl);
    // writeFileToJSon("gor.json", articles);

    // parse html and extract youth data
    // const youthArticles = await extractYouthArticles(youthUrl);
    // console.log(
    //   chalk.yellowBright(youthArticles),
    //   "============================="
    // );

    // parse html and extract history data
    // const historyArticles = await extractYouthArticles(history);
    // console.log(
    //   chalk.greenBright(historyArticles),
    //   "============================="
    // );

    const galleryArticles = await extractYouthArticles(gallery, "gallery.json");
    console.log(
      chalk.blueBright(galleryArticles),
      "============================="
    );

    // const videos = await extractVideos(videoUrl);
    // console.log(chalk.yellowBright(videos));

    // // add to mongodb
    // ClubArticles.insertMany(articles);
    // TODO stops this function from retu
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
})();

app.listen(5000, () => {
  console.log("scraper started");
});
