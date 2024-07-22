const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())

let times = []

// Create - Adicionar um novo time
app.post('/times', (req, res) => {
  const { nome } = req.body
  if (!nome) {
    return res.status(400).send('Nome do time é obrigatório')
  }
  const novoTime = { id: times.length + 1, nome, participantes: [] }
  times.push(novoTime)
  res.status(201).send(novoTime)
})

// Read - Listar todos os times
app.get('/times', (req, res) => {
  res.send(times)
})

// Update - Atualizar um time existente
app.put('/times/:id', (req, res) => {
  const { id } = req.params
  const { nome } = req.body
  const time = times.find(t => t.id == id)
  if (!time) {
    return res.status(404).send('Time não encontrado')
  }
  if (nome) {
    time.nome = nome
  }
  res.send(time)
})

// Delete - Remover um time
app.delete('/times/:id', (req, res) => {
  const { id } = req.params
  times = times.filter(t => t.id != id)
  res.status(204).send()
})

// Sorteio - Distribuir participantes entre os times
app.post('/sorteio', (req, res) => {
  const { participantes } = req.body
  if (!participantes || !Array.isArray(participantes)) {
    return res.status(400).send('Lista de participantes é obrigatória')
  }
  // Limpar participantes dos times
  times.forEach(time => time.participantes = [])
  // Distribuir participantes
  participantes.forEach((participante, index) => {
    const timeIndex = index % times.length
    times[timeIndex].participantes.push(participante)
  })
  res.send(times)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})