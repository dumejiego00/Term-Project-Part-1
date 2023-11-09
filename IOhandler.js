/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Tuesday, November 7, 2023
 * Author: Daniel Umejiego (A01376441)
 *
 */

const AdmZip = require("adm-zip"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

const { createReadStream, createWriteStream } = require("fs");
const { create } = require("domain");
const { readdir } = require("fs").promises;
const { pipeline } = require("stream");
const { Transform } = require("stream");
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(pathIn);
      zip.extractAllTo(pathOut);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    readdir(dir)
      .then((list) => {
        let finalList = [];
        for (const file of list) {
          if (path.extname(file) === ".png") {
            finalList.push(path.join(__dirname, "unzipped", file));
          }
        }
        resolve(finalList);
      })
      .catch((err) => reject(err));
  });
};

const extractFileName = (fullName) => {
  const splitFullName = fullName.split(path.sep);
  return splitFullName[splitFullName.length - 1];
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const png = new PNG({ filterType: 4 });
    pipeline(
      createReadStream(pathIn),
      png.on("parsed", function() {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            // invert color
            this.data[idx] = 255 - this.data[idx];
            this.data[idx + 1] = 255 - this.data[idx + 1];
            this.data[idx + 2] = 255 - this.data[idx + 2];
          }
        }
        this.pack().pipe(fs.createWriteStream(path.join(pathOut,extractFileName(pathIn))));
      }),
      createWriteStream(path.join(pathOut, extractFileName(pathIn))).on("finish", resolve),
      function (err) {
        if (err) {
          reject(err);
        }
      }
    );
  });
};

const filter = (arr, pathOut) => {
  const imgsToBeFiltered = [];
  for (const imgPath of arr) {
    imgsToBeFiltered.push(grayScale(imgPath, pathOut));
  }
  return imgsToBeFiltered;
};

module.exports = {
  unzip,
  readDir,
  grayScale,
  filter,
};
