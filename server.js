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

app.get('/api/v1/books/:id', (req, res) => {
    console.log(req.params.id);
    client.query(
        `SELECT * FROM books WHERE book_id=$1;`,
        [req.params.id])
        .then(result => res.send(result.rows))
        .catch(console.error);
});

app.post('/api/v1/books', (req, res) => {
    client.query(
        `INSERT INTO
        books(title, author, isbn, "image_url", description)
        VALUES ($1, #2, $3, $4, $5, $6);`,
        [
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.image_url,
            req.body.description
        ]
    )
    .then(function() {
        res.send(`insert complete`);
    })
    .catch(function(err) {
        console.error(err);
    });
});

// app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
