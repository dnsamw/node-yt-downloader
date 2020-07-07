const express = require("express"); //step 01 : import express module
const router = express.Router(); //step 02 : create router object
const app = express(); //step 03 : create express app
const expressHandlebars = require("express-handlebars");
const Handlebars = require("handlebars"); // view engine
const bodyParser = require("body-parser");
const axios = require("axios");
//const fs = require("fs");
const youtubedl = require("youtube-dl");

app.use("/", router);
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.use(
  bodyParser.json({
    extended: true,
  })
);

//Set Handlebars as default view engine
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase().replace(/\ /g, "-");
});

//CSS
router.use("/cssfiles", express.static(__dirname + "/css"));
//JS
router.use("/jsfiles", express.static(__dirname + "/js"));
//IMG
router.use("/imgfiles", express.static(__dirname + "/img"));

router.get("/", function (req, res) {
  //res.sendFile("index.html", { root: __dirname });
  res.render("home", { result: {} });
});

router.post("/", function (req, res) {
  const videoURL = req.body.ytvurl;
  const options = ["--username=user", "--password=hunter2"];

  const getVidInfo = async () => {
    console.log("here");
    try {
      const vidInfo = await youtubedl.getInfo(videoURL, options, function (
        err,
        info
      ) {
        if (err) throw err;

        const datsObj = {
          id: info.id,
          title: info.title,
          thumbnail: info.thumbnail,
          url: info.url,
          description: info.description,
        };
        console.log("id:", info.id);

        // console.log("title:", info.title);
        // console.log("url:", info.url);
        // console.log("thumbnail:", info.thumbnail);
        // console.log("description:", info.description);
        // console.log("filename:", info._filename);
        // console.log("format id:", info.format_id);
        //res.end(JSON.stringify(info));
        res.render("download", { result: datsObj });
      });
    } catch (error) {
      console.log(error);
    }
  };

  getVidInfo();
});

// const video = youtubedl(
//   "http://www.youtube.com/watch?v=90AiXO1pAiA",
//   // Optional arguments passed to youtube-dl.
//   ["--format=18"],
//   // Additional options can be given for calling `child_process.execFile()`.
//   { cwd: __dirname }
// );

// let fileName = "";

// Will be called when the download starts.
// video.on("info", function (info) {
//   console.log("Download started");
//   console.log("filename: " + info._filename);
//   console.log("size: " + info.size);
//   fileName = info._filename;
//   console.log(info);
// });

// video.pipe(fs.createWriteStream(fileName + ".mp4"));
app.listen(8080, function () {
  //step 04 : make app listen via an specific port.
  console.log("express server is up! : http://localhost:8080/");
});
