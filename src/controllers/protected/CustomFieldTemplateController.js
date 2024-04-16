const { default: mongoose } = require("mongoose");
const { ResponseHandler, ErrorHandler, CustomError } = require("../../utils/responseHandler");
const CustomField = require("../../models/CustomFields");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");

const createName = (inputString) => {
    const lowercaseString = inputString.toLowerCase();
    const words = lowercaseString.split(' ');
    const slug = words.join('_');
    return slug;
};


const createEditCustomField = async (req, res) => {
    try {
        const { id } = req.body;
        const domain = req.headers['domain'];
        const { title, post_type, item_type, customFields } = req.body;

        // Check if the post_type is already in use
        const existingCustomField = await CustomField.findOne({ post_type, domain });

        if (existingCustomField && (!id || existingCustomField._id.toString() !== id)) {
            throw new CustomError(400, 'We already have custom fields for this post type!');
        }

        const customFieldObject = {
            title,
            post_type,
            item_type,
            domain,
            fields: customFields.map((field) => ({
                name: createName(field.label) || '',
                label: field.label || '',
                variant: field.variant || '',
                field_type: field.field_type !== '' ? field.field_type : null,
                placeholder: field.placeholder || '',
            })),
        };

        let customField;

        if (mongoose.Types.ObjectId.isValid(id)) {
            customField = await CustomField.findById(id);
            if (!customField) {
                throw new CustomError(404, 'CustomField not found');
            }
        } else {
            customField = new CustomField(customFieldObject);
        }

        // Update or set fields based on the request body
        customField.title = title || customField.title;

        // Assuming fields is an array, replace existing fields with the new ones
        customField.fields = customFieldObject.fields;

        let updatedCustomField = await customField.save();
        updatedCustomField = { ...updatedCustomField.toObject(), id: updatedCustomField._id };

        ResponseHandler.success(res, { customField: updatedCustomField }, mongoose.Types.ObjectId.isValid(id) ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};



const getAllCustomField = async (req, res) => {
    try {
        const postType = req.params.post_type;
        const domain = req.headers['domain'];
        let allCustomField;
        if (postType !== undefined && postType !== 'all' && postType == 'page') {
            if (postType == 'page') {
                allCustomField = await CustomField.find({ item_type: postType }).sort({ createdAt: -1 });
            }else{
                allCustomField = await CustomField.findOne({ post_type: postType }).sort({ createdAt: -1 });
            }
        } else {
            allCustomField = await CustomField.find({ domain: domain }).sort({ createdAt: -1 });
        }

        ResponseHandler.success(res, { customField: allCustomField }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


const getCustomFieldById = async (req, res) => {
    try {
        const customFieldId = req.params.custom_field_id;
        if (!mongoose.Types.ObjectId.isValid(customFieldId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        const customField = await CustomField.findById(customFieldId);
        if (!customField) {
            throw new CustomError(404, 'CustomField not found');
        }

        const customFieldData = {
            id: customField._id,
            title: customField.title,
            fields: customField.fields,
            domain: customField.domain,
            post_type: customField.post_type,
        };

        ResponseHandler.success(res, customFieldData, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = { createEditCustomField, getAllCustomField, getCustomFieldById };
