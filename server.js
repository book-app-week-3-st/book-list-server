`use strict`;

// Application dependencies

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const TOKEN = process.env.TOKEN;

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


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
  console.log(req.body);
  client.query(
    `INSERT INTO
        books(title, author, isbn, "image_url", description)
        VALUES ($1, $2, $3, $4, $5);`,
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

app.put('/api/v1/books/:id', (request, response) => {
  client.query(`
    UPDATE books    
    SET title=$1, author=$2, isbn=$3, "image_url"=$4, description=$5
    WHERE book_id=$6`,
  [
    request.body.title,
    request.body.author,
    request.body.isbn,
    request.body.image_url,
    request.body.description,
    request.params.id
  ])
    .then(() => response.send('Update complete'))
    .catch(console.error);
});

app.delete('/api/v1/books/:id', (request, response) => {
  console.log(request.params.id);
  client.query(
    `DELETE FROM books WHERE book_id=$1;`, [request.params.id]
  )
    .then(() => response.send('Delete complete'))
    .catch(console.error);
});

app.get('/api/v1/admin', (req, res) => res.send(TOKEN === parseInt(req.query.token)));
app.get('/admin', (req, res) => console.log(req.query.token));


app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.get('/admin', (req, res) => res.send(TOKEN === parseInt(req.query.token)));
app.get('/admin', (req, res) => console.log(req.query.token));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
