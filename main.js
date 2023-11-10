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

async function unzipThenGrayscale() {
  try {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
    console.log("Extraction operation complete");
    const imgs = await IOhandler.readDir(pathUnzipped);
    Promise.all(IOhandler.grayScaleFilter(imgs, pathProcessed));
    console.log("All images has been gray scaled!");
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
}
unzipThenGrayscale();
