const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  res.send(`puhelinluettelossa ${persons.length} henkilön tiedot<br/><br/>
            ${new Date().toUTCString()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const required = ['name', 'number']
  const missing = required.filter(prop => body[prop] == undefined)

  if (missing.length > 0) {
    return res.send(400, { error: `Missing ${missing.join(' and ')}.` })
  }

  if (persons.some(person => person.name == body.name)) {
    return res.json(500, { error: 'Person already exists!' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 100000)
  }
  persons = [...persons, person]
  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id == req.params.id)
  if (person == undefined) {
    res.send(404)
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const count = persons.length
  persons = persons.filter(person => person.id != req.params.id)
  if (count == persons.length) {
    res.send(404)
  } else {
    res.send(204)
  }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
