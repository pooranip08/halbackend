var express = require("express");
var session = require("express-session");
var dbadapter = require("./dbadapter");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
// var inmemorydbadapter = require("./inmemorydbadapter");

var app = express();
app.use(cors());
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  })
);

// app.use(express.urlencoded({ extended: false, limit: "100mb" }));
// app.use(express.json({ extended: false, limit: "100mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    extended: false,
    limit: "50mb",
  })
);

function getDBAdapter(req) {
  var db = new dbadapter();
  // var db = new inmemorydbadapter(req.session);
  return db;
}

function sendJsonResult(res, obj) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(obj));
}

app.get("/getActive", function (req, res) {
  var db = getDBAdapter(req);
  db.getSurveys(function (result) {
    sendJsonResult(res, result);
  });
});

app.get("/getSurvey", function (req, res) {
  var db = getDBAdapter(req);
  var surveyId = req.query["surveyId"];
  db.getSurvey(surveyId, function (result) {
    sendJsonResult(res, result);
  });
});

app.get("/changeName", function (req, res) {
  var db = getDBAdapter(req);
  var id = req.query["id"];
  var name = req.query["name"];
  db.changeName(id, name, function (result) {
    sendJsonResult(res, result);
  });
});

app.get("/create", function (req, res) {
  var db = getDBAdapter(req);
  var name = req.query["name"];
  db.addSurvey(name, function (result) {
    sendJsonResult(res, { Name: result.name, Id: result.name });
  });
});

app.post("/changeJson", function (req, res) {
  var db = getDBAdapter(req);

  var id = req.body.Id;
  var json = req.body.Json;
  db.storeSurvey(id, json, function (result) {
    sendJsonResult(res, result.json);
  });
});

app.post("/uploadFile", function (req, res) {
  var db = getDBAdapter(req);

  const fileNames = Object.keys(req.files);
  fileNames.map((item) => {
    req.files[item].mv(
      path.join(__dirname, `./public/${req.files[item].name}`)
    );
    db.addImage(req.files[item].name, req.body.email, function (result) {});
  });

  return res.json(
    fileNames.map((item) => {
      return {
        url: `http://localhost:3001/${req.files[item].name}`,
      };
    })
  );
});

app.get("/getImages", function (req, res) {
  var db = getDBAdapter(req);

  db.getImages(function (result) {
    sendJsonResult(res, result);
  });
});

app.post("/post", function (req, res) {
  var db = getDBAdapter(req);
  var postId = req.body.postId;
  var surveyResult = req.body.surveyResult;
  db.postResults(postId, surveyResult, function (result) {
    sendJsonResult(res, result.json);
  });
});

app.get("/delete", function (req, res) {
  debugger;
  var db = getDBAdapter(req);
  var surveyId = req.query["id"];
  db.deleteSurvey(surveyId, function (result) {
    sendJsonResult(res, {});
  });
});

app.get("/update", function (req, res) {
  debugger;
  var db = getDBAdapter(req);
  var surveyId = req.query["id"];
  console.log(surveyId);

  db.updateSurvey(surveyId, function (result) {
    sendJsonResult(res, {});
  });
});

app.get("/results", function (req, res) {
  var db = getDBAdapter(req);
  var postId = req.query["postId"];
  db.getResults(postId, function (result) {
    sendJsonResult(res, result);
  });
});

app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3001, function () {
  console.log("Listening!");
});
