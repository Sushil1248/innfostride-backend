const mongoose = require('mongoose');

const customFieldsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    post_type: { type: String, required: true, unique: true  },
    item_type: { type: String, required: true },
    domain: { type: String, required: true },
    fields: [
      {
        name: { type: String, },
        label: { type: String },
        variant: { type: String },
        field_type: { type: String },
        placeholder: { type: String },
      },
    ],
  } , { timestamps: true });

const CustomField = mongoose.model('CustomField', customFieldsSchema);
module.exports = CustomField;