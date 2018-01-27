const Person = require('./models/person');

const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    JSON.stringify(req.body),
    tokens.status(req, res),
    tokens['response-time'](req, res), ' ms'
  ].join(' ')
}))

app.get('/info', (req, res) => {
  Person
    .count({})
    .then(response => {
      res.send(`puhelinluettelossa ${response} henkilön tiedot<br/><br/>
                ${new Date().toUTCString()}`);
    });
});

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(result => {
      res.json(result.map(Person.format))
    });
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const required = ['name', 'number']
  const missing = required.filter(prop => body[prop] == undefined)

  if (missing.length > 0) {
    return res.send(400, { error: `Missing ${missing.join(' and ')}.` })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  Person
    .count({ name: body.name })
    .then(count => {
      if (count > 0) {
        res.json(500, { error: 'Person already exists!' })
      } else {
        person
          .save()
          .then(saved => {
            res.json(Person.format(saved));
          })
          .catch(err => {
            res.send(500, { error: err });
          });
      }
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const required = ['name', 'number']
  const missing = required.filter(prop => body[prop] == undefined)

  if (missing.length > 0) {
    return res.send(400, { error: `Missing ${missing.join(' and ')}.` })
  }

  const person = new Person({
    _id: req.params.id,
    name: body.name,
    number: body.number
  });

  Person
    .update({ _id: req.params.id }, person)
    .then(response => {
      console.log(response)
      res.send(Person.format(response))
    });
});

app.get('/api/persons/:id', (req, res) => {
  Person
    .find({ _id: req.params.id })
    .then(response => {
      if (response.length > 0) {
        res.send(Person.format(response[0]));
      } else {
        res.send(404);
      }
    })
    .catch(err => console.log(err));
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .deleteOne({
      _id: req.params.id
    })
    .then(res => {
      console.log(res)
    })
  res.send(204);
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
