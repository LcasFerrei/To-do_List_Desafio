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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ROTA PARA LER TODAS AS TAREFAS
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY status DESC, id DESC";
  db. all(sql, [], (err, rows) =>{
    if(err){
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message":"success",
      "data": rows
    })
  })
})

//ROTA PARA CRIAR UMA NOVA TAREFA
app.post("/tasks", (req,res) => {
  const {title, description, due_date} = req.body;
  if(!title){
    res.status(400).json({"error": "O titulo da tarefa é obrigatório."})
    return;
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
  const { title, description, status } = req.body;
  const { id } = req.params;

  if (!title || !status) {
    res.status(400).json({ "error": "Título e status são obrigatórios." });
    return;
  }

  const sql = `
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status)
    WHERE id = ?
    `;

    const params = [title, description, status, id];

    db.run(sql, params, function (err){
      if(err){
        res.status(400).json({"error": res.message});
        return;
      }
      // this.changes retorna o número de linhas afetadas. Se for 0, a tarefa não foi encontrada.
      if (this.changes === 0){
        res.status(404).json({"error": `Tarefa com id ${id} não encontrada.`})
        return;
      }
      res.json({
        message: "success",
        data: {id: id, title, description, status},
        changes: this.changes
      })
    })
})


// ROTA PARA DELETAR UMA TAREFA
// ROTA PARA DELETAR (DELETE) UMA TAREFA
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tasks WHERE id = ?';
  
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ "error": `Tarefa com id ${id} não encontrada.` });
      return;
    }
    res.json({ "message": "deleted", changes: this.changes });
  });
});