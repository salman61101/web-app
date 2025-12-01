const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
    process.exit(1);
  }
});

// Initialize schema and seed data if needed
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (err) {
      console.error('Failed to count users', err);
      return;
    }
    if (!row || row.count === 0) {
      const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
      stmt.run('Alice Example', 'alice@example.com');
      stmt.run('Bob Example', 'bob@example.com');
      stmt.finalize();
      console.log('Inserted seed users');
    }
  });
});

module.exports = db;
