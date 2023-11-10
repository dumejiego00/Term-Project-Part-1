/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: Tuesday, November 7, 2023
 * Author: Daniel Umejiego (A01376441)
 *
 */

const path = require("path");
const IOhandler = require("./IOhandler");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => console.log("Extraction operation complete"))
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((imgs) => {
    Promise.all(IOhandler.grayScaleFilter(imgs, pathProcessed));
  })
  .then(() => console.log("All images has been gray-scaled!"))
  .catch((err) => console.log(err));
