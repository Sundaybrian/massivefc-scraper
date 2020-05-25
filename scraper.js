const axios = require("axios");
const fs = require("fs");

// various action will be here

async function createFile(html) {
  fs.writeFile("gor.html", html, (err) => {
    if (err) console.log(err);
    else console.log("file written");
  });
}

exports.createFile = createFile;
