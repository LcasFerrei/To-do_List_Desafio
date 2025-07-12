const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = "db.sqlite";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'pendente'
    )`, (err) => {
      if (err) {
        console.log('Tabela "tasks" já existe.');
      } else {
        console.log('Tabela "tasks" criada com sucesso.');
      }
    });
  }
});

module.exports = db;