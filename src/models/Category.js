const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    postType: { type: String, default: null },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String, default: '' },
}, {
    timestamps: true, 
});

categorySchema.index({ slug: 1 });

// Validation
categorySchema.path('slug').validate((value) => /^[a-zA-Z0-9-]+$/.test(value), 'Invalid slug format');

categorySchema.pre('remove', async function(next) {
    await Category.deleteMany({ parentCategory: this._id });
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;