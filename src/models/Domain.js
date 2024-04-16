const mongoose = require('mongoose');

const domainShcema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  href: {type: String, required: true, unique: true},
});

const Domain = mongoose.model('Domain', domainShcema);
module.exports = Domain;