const express = require('express');
const { Client } = require('pg');
const { check, validationResult } = require('express-validator');

const client = new Client({
  user: 'pinkAdmin',
  host: 'postgres',
  database: 'spyOnThem',
  password: 'onTheRainbow',
  port: 5432,
});

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'What this', errors: '', data: '' });
});

router.post(
  '/',
  [
    check('fname').isLength({ min: 1 }).withMessage('Please enter a name'),
    check('lname').isLength({ min: 1 }).withMessage('Please enter a name'),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      res.send('Thank you citizen');
    } else {
      console.log(req.body);
      res.render('index', {
        title: 'Registration form',
        errors: error.array(),
        data: req.body,
      });
    }
  },
);

router.get('/people', (req, res) => {
  res.render('person');
});

router.get('/addJon', (req, res) => {
  res.render('jonTestnow');
});

router.post('/addJon', (req, res) => {
  const query = {
    text: 'INSERT INTO person(first_name, last_name) VALUES($1, $2)',
    values: ['Jon', 'Snow'],
  };

  client.connect();

  client
    .query(query)
    .then((res) => console.log(res.rows[0]))
    .catch((e) => console.error(e.stack));

  client.end();

  res.send('You know nothing');
});

module.exports = router;
