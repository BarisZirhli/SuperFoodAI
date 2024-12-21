const { Client } = require('pg');

const createDatabase = async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    port: 5432,
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE "SuperFoodDb";');
    console.log('Database created successfully!');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
};

createDatabase();