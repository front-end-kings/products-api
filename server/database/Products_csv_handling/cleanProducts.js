const fs = require('fs');
const path = require('path');
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const Transform = require("stream").Transform;
const csv = require('csv-parser');

const csvStringifier = createCsvStringifier({
  header: [
    { id: "prid", title: "prid" },
    { id: "name", title: "name" },
    { id: "slogan", title: "slogan" },
    { id: "description", title: "description" },
    { id: "category", title: "category" },
    { id: "default_price", title: "default_price" },
  ],
});

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
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
    //filters out all non-number characters
    console.log(chunk)
    const isNumber = /^\d+$/.test(chunk.default_price);
    if (!isNumber) {
      let onlyNumbers = chunk.default_price.replace(/\D/g, "");
      chunk.default_price = onlyNumbers;
    }
    //uses our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

const jsonPath = path.join(__dirname, 'product.csv');
const writePath = path.join(__dirname, 'clean_product.csv');
const table_name = 'products';

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
