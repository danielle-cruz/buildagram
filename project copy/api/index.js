"use strict";

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");

let DATABASE_NAME = "buildagram"

let api = express.Router();
let connection;
let db;
let Images;

module.exports = async (app) => {
  app.set("json spaces", 2);

  /* Connect to MongoDB */
  connection = await MongoClient.connect("mongodb://localhost", {useUnifiedTopology: true});
  db = connection.db(DATABASE_NAME);
  Images = db.collection("images");

  app.use("/api", api);
};

api.use(cors());
api.use(bodyParser.json({ limit: "50mb" }));

/* Middleware */
api.use("/images/:file", async (req, res, next) => {
  let file = req.params.file;
  let image = await Images.findOne({file});
  /* Check if user with given id exists */
  if (!image) {
    res.status(404).json({error: "Image does not exist"});
    return;
  }
  /* Pass user with given id on to next method */
  res.locals.image = image;
  next();
});

api.get("/", (req, res) => {
  res.json({ success: true });
});

/* Get a list of existing images */
api.get("/images", async (req, res) => {
  let images = await Images.find().toArray();
  res.json({images: images.map(image => image.file)});
});

/* Get the image for the filename */
api.get("/images/:file", async (req, res) => {
  let image = res.locals.image;
  let {file} = image;
  res.json({file});
});

/* Create a new image with the filename */
api.post("/images", async (req, res) => {
  let file = req.body.file;
  // Check if file is missing
  if (!file) {
    res.status(400).json({error: "Request body is missing a file, or the file is empty"});
    return;
  }
  await Images.insertOne({file});
  res.json({file});
});
