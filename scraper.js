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

// recursively collect news pages
async function extractArticles(url) {
  let articles = [];
  try {
    // fetch html
    const res = await axios.get(url);
    if (res.status == 404) return articles.slice(0, articles.length);

    console.log(`Extracting data from url :${url}`);
    const $ = cheerio.load(res.data);
    articles = await articlesOnPage($);

    // Go to next page
    // "http://gormahiafc.co.ke/category/news/page/2/".match(/page\/(\d+)/);

    const nextpage = parseInt(url.match(/page\/(\d+)/)[1], 10) + 1;
    const nextUrl = `http://gormahiafc.co.ke/category/news/page/${nextpage}/`;

    console.log(`Extracting next page ${nextUrl}`);
    // recursively access next page
    return articles.concat(await extractArticles(nextUrl));
  } catch (error) {
    console.log(
      `Error in scrapping terminanting:......................${url} `
    );
    return articles.slice(0, articles.length);
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
      category: $(this)
        .attr("class")
        .split(" ")
        .find((item) => item.startsWith("category")),
    });
  });

  return articles;
}

// *********************************youth page************************************
// recursively collect news pages
async function extractYouthArticles(url) {
  let articles = [];
  try {
    // fetch html
    const res = await axios.get(url);
    if (res.status == 404) return articles;

    console.log(`Extracting data from url :${url}`);
    const $ = cheerio.load(res.data);
    articles = await articlesOnPage($);

    // generate youthjson
    writeFileToJSon("youth.json", articles);

    return articles;
  } catch (error) {
    console.log(
      `Error in scrapping terminanting:......................${url} `
    );
    return articles;
  }
}

// generate json file
async function writeFileToJSon(filename, list) {
  fs.writeFileSync(filename, JSON.stringify(list, null, 4), (err) => {
    if (err) throw err;
    console.log("-------------File succesfully written------------");
    process.exit(0);
  });
}

async function readHtmlFile(file) {
  fs.readFile(file, "utf8", function (err, data) {
    // Display the file content
    createContent(data);
  });
}

exports.extractArticles = extractArticles;
exports.extractYouthArticles = extractYouthArticles;
exports.writeFileToJSon = writeFileToJSon;
