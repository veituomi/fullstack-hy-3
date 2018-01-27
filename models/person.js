const mongoose = require('mongoose');

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url);
mongoose.Promise = global.Promise;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = ({ _id, name, number}) => ({
  id: _id,
  name,
  number
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
