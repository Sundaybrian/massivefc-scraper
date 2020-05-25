const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const ClubArticles = require("./models/Article");
const Club = require("./models/Club");

// various action will be here

async function getClubId(clubname) {
  try {
    const club = await Club.findOne({ name: clubname });
    return club;
  } catch (error) {
    console.log(error);
  }
}

async function createFile(html) {
  fs.writeFile("gor.html", html, (err) => {
    if (err) console.log(err);
    else console.log("file written");
  });
}

async function createContent(data) {
  const $ = cheerio.load(data);
  let club = await getClubId("gormahiafc");

  let articles = [];
  // grabbing all anchor tags with class post-thumb
  $("li.post-item").each(function (i, elem) {
    // creating objects from each element

    articles[i] = new ClubArticles({
      club: club._id,
      title: $(this).find("h2.post-title").children("a").text().trim(),
      url: $(this).children("a.post-thumb").attr("href"),
      imageUrl: $(this).find("img").attr("src"),
      dateCreated: $(this).find("span.date.meta-item").text().trim(),
    });
  });

  try {
    // generate json
    writeFileToJSon("gor.json", articles);

    const bulkAdd = await ClubArticles.insertMany(articles);
  } catch (error) {
    console.log(error);
  }
}

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
exports.createContent = createContent;
exports.readHtmlFile = readHtmlFile;
