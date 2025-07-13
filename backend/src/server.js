const express = require('express');
const cors = require('cors');
const db = require('./database/db.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API da To-Do List está funcionando!" });
});

// ROTA PARA LER TODAS AS TAREFAS
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY status DESC, id DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// ROTA PARA CRIAR UMA NOVA TAREFA
app.post("/tasks", (req, res) => {
  const { title, description, due_date } = req.body;
  if (!title) {
    return res.status(400).json({ "error": "O título da tarefa é obrigatório." });
  }

  if (due_date && new Date(due_date) < new Date()) {
    return res.status(400).json({ "error": "A data de vencimento não pode ser no passado." });
  }

  const sql = 'INSERT INTO tasks (title, description, due_date) VALUES (?,?,?)';
  const params = [title, description, due_date];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "message": "success",
      "data": { id: this.lastID, title, description, due_date, status: 'pendente' }
    });
  });
});

// ROTA PARA ATUALIZAR UMA TAREFA EXISTENTE
app.put("/tasks/:id", (req, res) => {
  const { title, description, status, due_date } = req.body;
  const { id } = req.params;

  if (!title || !status) {
    return res.status(400).json({ "error": "Título e status são obrigatórios." });
  }

  if (due_date && new Date(due_date) < new Date()) {
    return res.status(400).json({ "error": "A data de vencimento não pode ser no passado." });
  }

  db.serialize(() => {
    const updateSql = `
      UPDATE tasks SET 
        title = ?, 
        description = ?, 
        status = ?,
        due_date = ?
      WHERE id = ?
    `;
    const params = [title, description, status, due_date, id];

    db.run(updateSql, params, function (err) {
      if (err) {
        console.error("Erro ao atualizar a tarefa:", err.message);
        return;
      }
    });

    const selectSql = "SELECT * FROM tasks WHERE id = ?";
    db.get(selectSql, id, (err, row) => {
      if (err) {
        return res.status(400).json({ "error": err.message });
      }
      if (!row) {
        return res.status(404).json({ "error": `Tarefa com id ${id} não encontrada após atualização.` });
      }
      res.json({
        message: "success",
        data: row
      });
    });
  });
});


// ROTA PARA DELETAR UMA TAREFA
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ "error": `Tarefa com id ${id} não encontrada.` });
      return;
    }
    res.json({ "message": "deleted", changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
