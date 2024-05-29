
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { insertData } = require('./src/bigquery');

const app = express();
app.use(bodyParser.json());

app.post('/create-order', async (req, res) => {
  const formData = req.body;

  try {
    // Captura la solicitud
    console.log('Request payload:', formData);

    // Realiza la solicitud de autenticación
    const authResponse = await axios.post(
      'https://hoth.gascosistemas.com/v1/systemUsersAuth/auth',
      {
        username: 'user-predictive-order',
        password: 'predictiveOrder',
      },
      {
        headers: {
          accept: 'application/json',
          'x-business': 'CLIENTES',
          'x-commerce': 'GASCO',
          'x-country': 'CL',
          'x-system': 'SMS_NOTIFICATION',
          'x-user': 'api-bulk',
          'Content-Type': 'application/json',
        },
      }
    );

    // Verifica si la autenticación fue exitosa y obtén el token
    if (authResponse.status !== 200 || !authResponse.data.data.accessToken) {
      throw new Error('Error en la autenticación');
    }

    const token = authResponse.data.data.accessToken;
    console.log('Token obtenido:', token);

    // Realiza la solicitud para crear el pedido
    const orderResponse = await axios.post(
      'https://hoth.gascosistemas.com/gasco-bulk-systems/v1.0.0/orders/corporative/create',
      formData,
      {
        headers: {
          accept: 'application/json',
          'x-business': 'CLIENTES',
          'x-commerce': 'GASCO',
          'x-country': 'CL',
          'x-system': 'PREDICTIVE_ORDER',
          'x-user': 'user-predictive-order',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Respuesta del pedido:', orderResponse.data);

    // Extraer campos individuales
    const responseData = orderResponse.data.data;
    const responseMetadata = orderResponse.data.metadata;

    // Inserta los datos en BigQuery
    const rows = [
      {
        ...formData,
        ...responseData,
        ...responseMetadata,
        timestamp: new Date().toISOString(),
      }
    ];

    await insertData(rows);
    console.log('Datos enviados a bigquery:', rows);

    res.status(200).send(orderResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Error creating order', details: error.response ? error.response.data : error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
