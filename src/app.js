const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

  /*
  id: "uuid", 
  title: 'Desafio Node.js', 
  url: 'http://github.com/...', 
  echs: ["Node.js", "..."], 
  likes: 0 
  */

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {id, title, url,techs} = request.body;
  

  const resultado = repositories.push({
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  });


  return response.json(repositories[resultado-1]);
  
});

app.put("/repositories/:id", async (request, response) => {

  const {title, url, techs} = request.body;

  const repository = await repositories.find(repo => repo.id === request.params.id);

  if (!repository) {
    return response
      .status(400)
      .json({ error: 'repository not exist' });
  }

  const {id,likes} = repository;

  const index = await repositories.findIndex(repo => repo.id === request.params.id);


  repositories[index] = 
  {
    id,
    title,
    url,
    techs,
    likes
  }

  //console.log(repositories[0]);

  return response.json(repositories[index]);

});

app.delete("/repositories/:id", async (req, res) => {


  const repository = await repositories.find(repo => repo.id === req.params.id);
  
 

  if (!repository) {
    return res
      .status(400)
      .json({ error: 'repository not exist' });
  }
  

  const index = await repositories.findIndex(repo => repo.id === req.params.id);

  repositories.splice(index, 1); 

  return res.status(204).json({ message: 'repository deleted!' });

});

app.post("/repositories/:id/like", async (request, response) => {

  const repository = await repositories.find(repo => repo.id === request.params.id);

  if (!repository) {
    return response
      .status(400)
      .json({ error: 'repository not exist' });
  }

  const {id,title,url,techs,likes} = repository;

  const newLikes = likes + 1;

  const index = await repositories.findIndex(repo => repo.id === request.params.id);


  repositories[index] = 
  {
    id,
    title,
    url,
    techs,
    likes: newLikes
  }

  return response.json(repositories[index]);
});

module.exports = app;
