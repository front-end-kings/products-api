const fs = require('fs');
const path = require('path');
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const Transform = require("stream").Transform;
const csv = require('csv-parser');

const csvStringifier = createCsvStringifier({
  header: [
    { id: "id", title: "id" },
    { id: "styleId", title: "styleId" },
    { id: "url", title: "url" },
    { id: "thumbnail_url", title: "thumbnail_url" },
  ],
});

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
    this.lastNum = 0;
  }
  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      //trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }

    let number = Number(chunk.id);
    if (number === this.lastNum) {
      chunk.id = number + 1;
      this.lastNum = number + 1;
    } else {
      this.lastNum = number;
    }
    console.log(chunk);
    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

const jsonPath = path.join(__dirname, 'photos.csv');
const writePath = path.join(__dirname, 'clean_photos.csv');

const fileStream = fs.createReadStream(jsonPath);
let writeStream = fs.createWriteStream(writePath);

const transformer = new CSVCleaner({ writableObjectMode: true });
writeStream.write(csvStringifier.getHeaderString());

fileStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on("finish", () => {
    console.log("finished");
  });
