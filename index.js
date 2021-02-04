const express = require('express');
const pool = require('./data/dbConfig');

const app = express();

app.use(express.json());

app.post("/post-todo", async (req, res) => {
   try {
      const { description } = req.body;
      const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
      res.status(200).json(newTodo.rows[0]);
   } catch (error) {
      res.status(500).json(error.message);
   }
});

app.get("/todos", async (req, res) => {
   try {
      const todos = await pool.query('SELECT * FROM todo');
      res.status(200).json(todos.rows);
   } catch (error) {
      res.status(500).json(error.message);
   }
});

app.get('/todo/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const todo = await pool.query(`SELECT * FROM todo WHERE todo.id = $1`, [id]);
      res.status(200).json(todo.rows[0]);
   } catch (error) {
      res.status(500).json(error.message);
   }
});

app.put('/todo/:id', async (req, res) => {
   const { id } = req.params;
   const { description } = req.body;
   try {
      const updatedTodo = await pool.query('UPDATE todo SET description = $1 WHERE todo.id = $2 RETURNING *', [description, id]);
      res.status(200).json(updatedTodo.rows[0]);
   } catch (error) {
      res.status(200).json(error.message);
   }
});

app.delete('/todo/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const deletedTodo  = await pool.query('DELETE FROM todo WHERE todo.id = $1 RETURNING *', [id]);
      res.status(200).json(deletedTodo.rows);
   } catch (error) {
      res.status(500).json(error.message);
   }
});


app.listen(5003, () => console.log("server runnin in port 5000"));
