const mongoose = require('mongoose');

const url = 'mongodb://fullstack:secret@ds217138.mlab.com:17138/fullstack-course';

const params = process.argv.slice(2, process.argv.length);

mongoose.connect(url);
mongoose.Promise = global.Promise;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema);

let promise;

if (params.length === 0) {
  promise = Person
    .find({})
    .then(res => {
      console.log('puhelinluettelo:')
      res.forEach(person => {
        console.log(person.name + ' ' + person.number);
      });
    });
} else {
  const [name, number] = params;

  const person = new Person({
    name,
    number
  });

  promise = person
    .save()
    .then(response => {
      console.log('lisätään henkilö ' + name + ' numero ' + number + ' luetteloon');
      console.log(response)
    });
}

promise.then(() => {
  mongoose.connection.close();
});
