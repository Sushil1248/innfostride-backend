const mongoose = require('mongoose');

const postMetaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customFields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  customRepeaterFields: [
    {
      id:{type:String},
      name: { type: String, required: true },
      type: {type: String},
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ]
});

const PostMeta = mongoose.model('PostMeta', postMetaSchema);

module.exports = PostMeta;