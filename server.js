`use strict`

// Application dependencies

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Application Setup

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//API endpoints

app.use(cors());

app.get('/api/v1/books', (req,res) => {
    client.query(
        `SELECT book_id, title, author, image_url FROM books;`)
        .then(result => res.send(result.rows))
        .catch(console.error);
    });

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
