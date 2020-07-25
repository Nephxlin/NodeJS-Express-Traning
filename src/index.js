const express = require('express');
const {uuid, isUuid} = require('uuidv4')

const app = express();

app.use(express.json())

/*
Metodos http:

GET = Buscar Informações do Back-end
POST = Criar uma informação no back-en
PUT/PATCH = alterar uma informação no back-end
DELETE = Deletar uma informação no back-end
*/

/*
Tipos de parametros:

query params: Filtros e paginação
route params: Indentificar recursos(atualizar ou deletar)
request body: Conteudo na hora de criar ou editar recurso [json]

MIDLEWARE:

Interceptador de requisições que interromper totalmente a requisição
alterar dados da requisição

*/
const projects = [];

function logRequest(request,response, next){
  const {method, url} = request;

  const logLabel = `${method.toUpperCase()},${url}`

  console.log('1')
  console.time(logLabel)

  next()
  console.timeEnd(logLabel)
}

function validadeProjectId(request,response,next){
  const {id} = request.params
  if (!isUuid(id)){
    return response.status(400).json({ error :'Invalid Project ID'})
  }

  return next();
}

app.use(logRequest)
app.use('/projects/:id',validadeProjectId)

app.get('/projects', (request,response) => {
  const {title} = request.query

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects/',(request,response) =>{
  const { title, owner } = request.body

  const project = { id: uuid(), title, owner};
  
  projects.push(project)

  return response.json(project)
});

app.put('/projects/:id',(request,response) =>{
  const { title, owner } = request.body
  const { id }= request.params

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found'})
  }

  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project
  
  return response.json(project);
});

app.delete('/projects/:id',(request,response) =>{
  const { id } = request.params
  
  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found'})
  }

  projects.splice(projectIndex,1)
  return response.status(204).send();
});

app.listen(3000,()=>{
  console.log('back-end Started ✔')
})