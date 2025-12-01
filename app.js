const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// List users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY id', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('users', { users: rows });
  });
});

// Show new user form
app.get('/users/new', (req, res) => {
  res.render('new_user');
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to create user');
    }
    res.redirect('/users');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
