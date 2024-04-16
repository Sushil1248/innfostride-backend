const { default: mongoose } = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        required: true
    }
});
const navigationItemSchema = new mongoose.Schema({
    domain_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: () => 'default' 
    },
    route: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    imgURL: {
        type: String,
        required: true
    },
    category: {
        type: Boolean,
        default: false
    },
    subcategory: [subcategorySchema]
});

const NavigationItem = mongoose.model('NavigationItem', navigationItemSchema);
module.exports = NavigationItem;
