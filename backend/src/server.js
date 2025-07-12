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