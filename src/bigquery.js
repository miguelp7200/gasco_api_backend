// src/bigquery.js
const path = require('path');
const { BigQuery } = require('@google-cloud/bigquery');

// Carga el archivo de credenciales JSON
const keyPath = path.join(__dirname, '/key/datalake-gasco-d2f84746fcd3.json');

// Inicializa el cliente de BigQuery
const bigquery = new BigQuery({
  keyFilename: keyPath,
  projectId: 'datalake-gasco', // ID de proyecto de Google Cloud
});

const insertData = async (rows) => {
  const datasetId = 'parquet_test'; // ID de dataset
  const tableId = 'api_test';            // ID de tabla

  try {
    await bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(rows);
    console.log(`Inserted ${rows.length} rows`);
  } catch (error) {
    console.error('Error inserting data into BigQuery', error);
  }
};

module.exports = { insertData };
