CREATE OR REPLACE TABLE `datalake-gasco.parquet_test.api_test`
(
  center STRING,
  deliveryDate STRING,
  fromDeliveryHour STRING,
  initialWeight STRING,
  liters STRING,
  observation STRING,
  organization STRING,
  sort2 STRING,
  untilDeliveryHour STRING,
  message STRING,
  statusCode STRING,
  statusMessage STRING,
  timestamp TIMESTAMP
)
PARTITION BY DATE(timestamp)
OPTIONS (
  description="Tabla de pedidos particionada por fecha"
);