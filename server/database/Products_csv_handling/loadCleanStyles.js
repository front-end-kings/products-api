const config = require('../../../config/config.js');
const { Client, Pool } = require('pg');
const copyFrom = require('pg-copy-streams').from
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'products',
  password: config.TOKEN,
  port: 5432,
});

client.connect()
.then(console.log('connected'))
.catch((err) => console.log(err));

//Join csv path file
const jsonPath = path.join(__dirname, 'styles.csv');
const table_name = 'styles';
//Create your queries here
const create_table = `
DROP TABLE IF EXISTS ${table_name};
CREATE TABLE IF NOT EXISTS ${table_name} (
  ID SERIAL primary key,
  PRODUCTID INT NOT NULL REFERENCES products,
  NAME TEXT,
  SALE_PRICE TEXT,
  ORIGINAL_PRICE INT,
  DEFAULT_STYLE BOOLEAN
);`;

const create_index = `
CREATE INDEX index_styles_prod
    ON public.styles USING btree
    (productid ASC NULLS LAST)
    TABLESPACE pg_default;`;

// Table creation & deletion
client.query(create_table).then(res => console.log('Table successfully created!'));

const stream = client.query(copyFrom(`COPY ${table_name} FROM STDIN DELIMITER ',' CSV HEADER;`));

//Create file stream reading object
const fileStream = fs.createReadStream(jsonPath);
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
    client.query(create_index).then(() => {
      console.log('created index');
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    })
})
/* ************************************ */

fileStream.on('open', () => {
  fileStream.pipe(stream);
}
);
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});