const express = require("express"); //step 01 : import express module
const router = express.Router(); //step 02 : create router object
const app = express(); //step 03 : create express app
const expressHandlebars = require("express-handlebars");
const Handlebars = require("handlebars"); // view engine
const bodyParser = require("body-parser");
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
    console.log("Awaiting response : youtube...");
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
          resolution: info.height,
          duration: info.duration,
          formats: info.formats,
        };

        let filesArray = [];

        for (let i = 0; i < info.formats.length - 1; i++) {
          if (info.formats[i].ext === "webm") {
            //console.log("yes!");
            filesArray[i] = {
              resolution: info.formats[i].format,
              type: info.formats[i].ext,
              url: info.formats[i].url,
              size:
                Math.ceil(
                  Number(info.formats[i].filesize / 1024 / 1024) * 100
                ) / 100,
            };
          }
        }
        // let outArray = [];
        // for (const iterator of filesArray) {
        //   outArray += iterator.resolution;
        // }
        console.log(filesArray);
        res.render("download", { result: { one: datsObj, two: filesArray } });
        //res.end(JSON.stringify(info));
      });
    } catch (error) {
      console.log(error);
      res.end("NO INTERNET!");
    }
  };
  getVidInfo();
});
app.listen(8080, function () {
  console.log("express server is up! : http://localhost:8080/");
});
