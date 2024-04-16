const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    post_type: { type: String, required: true },
    domain: { type: String, required: true },
    slug: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featuredImage: { type: String },
    status: { type: String, enum: ['draft', 'published', 'archived', 'trash'], default: 'draft' },
    comments: [{ user: String, content: String, date: { type: Date, default: Date.now } }],
    postMeta: { type: mongoose.Schema.Types.ObjectId, ref: 'PostMeta' },
    deleted: { type: Boolean, default: false } // Soft delete indicator
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
