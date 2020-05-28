const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const ClubArticles = require("./models/Article");
const Club = require("./models/Club");

// various action will be here

// fetch club id
async function getClubId(clubname) {
  try {
    const club = await Club.findOne({ name: clubname });
    return club;
  } catch (error) {
    console.log(error);
  }
}

// create html file
async function createFile(html) {
  fs.writeFile("gor.html", html, (err) => {
    if (err) console.log(err);
    else console.log("file written");
  });
}

// reap data from the html file
async function extractArticles(url) {
  try {
    // fetch html
    const res = await axios.get(url);

    const $ = cheerio.load(res.data);

    console.log(`Extracting data from url :${url}`);
    const articles = await articlesOnPage($);

    // shoud we end recurssion
    if (articles.length < 1) {
      console.log(`Terminating scrapper:${url} `);
      return articles;
    } else {
      // Go to next page
      // "http://gormahiafc.co.ke/category/news/page/2/".match(/page\/(\d+)/);

      const nextpage = parseInt(url.match(/page\/(\d+)/)[1]) + 1;
      const nextUrl = `${url}/page/${nextpage}/`;

      console.log(nextpage, "nextpage");
      console.log(`Extracting next page ${nextUrl}`);

      // recursively access next page
      return articles.concat(await extractArticles(nextUrl));
    }
  } catch (error) {
    console.log(error);
  }
}

// reaper of data
async function articlesOnPage($) {
  // $ is the cheerio object

  // TODO: fix this to be dynamic later on
  let club = await getClubId("gormahiafc");

  let articles = [];

  // extracting the data we need
  $("li.post-item").each(function (i, elem) {
    // creating objects from each element87
    articles[i] = new ClubArticles({
      club: club._id,
      title: $(this).find("h2.post-title").children("a").text().trim(),
      url: $(this).children("a.post-thumb").attr("href"),
      excerpt: $(this).find("p.post-excerpt").text(),
      imageUrl: $(this).find("img").attr("src"),
      createdAt: $(this).find("span.date.meta-item").text().trim(),
      scrappedDate: new Date().toISOString(),
    });
  });

  return articles;
}

// generate json file
async function writeFileToJSon(filename, list) {
  fs.writeFile(filename, JSON.stringify(list, null, 4), (err) => {
    console.log("File succesfully written");
  });
}

async function readHtmlFile(file) {
  fs.readFile(file, "utf8", function (err, data) {
    // Display the file content
    createContent(data);
  });
}

exports.createFile = createFile;
exports.extractArticles = extractArticles;
exports.readHtmlFile = readHtmlFile;
