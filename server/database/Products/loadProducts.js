// const config = require('../../../config/config.js');
const { Client, Pool } = require('pg');
const copyFrom = require('pg-copy-streams').from
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

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'products',
  password: 'phantasm',
  port: 5432,
});

client.connect()
.then(console.log('connected'))
.catch((err) => console.log(err));

//Join csv path file
const jsonPath = path.join(__dirname, 'product.csv');
const writePath = path.join(__dirname, 'clean_product.csv');
const table_name = 'products';
//Create your queries here
const create_table = `
DROP TABLE IF EXISTS ${table_name};
CREATE TABLE IF NOT EXISTS ${table_name} (
  PRID INT NOT NULL,
  NAME TEXT,
  SLOGAN TEXT,
  DESCRIPTION TEXT,
  CATEGORY TEXT,
  DEFAULT_PRICE INT
);`;

// Table creation & deletion
client.query(create_table).then(res => console.log('Table successfully created!'));


const stream = client.query(copyFrom(`COPY ${table_name} FROM STDIN DELIMITER ',' CSV HEADER;`));

// //Create file stream reading object
const fileStream = fs.createReadStream(writePath);
// let writeStream = fs.createWriteStream(writePath);

console.time('Execution Time'); // Time it

/* Trouble shooting where in file reading went wrong*/
fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${table_name} `)
    client.end();
})
/* ************************************ */

// const transformer = new CSVCleaner({ writableObjectMode: true });
// writeStream.write(csvStringifier.getHeaderString());


// fileStream
//   .pipe(csv())
//   .pipe(transformer)
//   .pipe(writeStream)
//   .on("finish", () => {
//     console.log("finished");
//   });

fileStream.on('open', () => {
  fileStream.pipe(stream);
}
);
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});
