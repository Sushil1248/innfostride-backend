const { default: mongoose } = require("mongoose");
const { ResponseHandler, ErrorHandler } = require("../../utils/responseHandler");
const Category = require("../../models/Category");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");

const createEditCategory = async (req, res) => {
    try {
        const { id } = req.body;

        const { name, slug, parentCategory, description, postType  } = req.body;

        const categoryObject = {
            name,
            slug,
            parentCategory,
            description,
            postType
        };

        let category;

        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
            if (!category) {
                throw new CustomError(404, 'Category not found');
            }
        } else {
            category = new Category(categoryObject);
        }

        // Update or set fields based on the request body
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.parentCategory = parentCategory!=''? parentCategory: null;
        category.description = description || category.description;
        category.postType = postType || category.postType;
       

        let updatedCategory = await category.save();
        updatedCategory = { ...updatedCategory.toObject(), id: updatedCategory._id };

        // Return the updated or newly created category
        ResponseHandler.success(res, { category: updatedCategory }, mongoose.Types.ObjectId.isValid(id) ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


const getAllCategories = async (req, res) => {
    try {
        // Retrieve all categories
        const postType = req.params.post_type;
        const allCategories = await Category.find().where('postType').equals(postType);
        const categoryMap = new Map(allCategories.map((category) => [category._id.toString(), category]));

        const buildCategoryTree = (parentCategoryId) => {
            const children = allCategories
                .filter((category) => category.parentCategory?.toString() === parentCategoryId)
                .map((childCategory) => buildCategoryTree(childCategory._id.toString()));

            const category = categoryMap.get(parentCategoryId);
            if (!category) {
                return null;
            }

            return {
                key: category._id.toString(),
                label: category.name,
                data: category.description,
                slug:category.slug,
                children,
            };
        };

        // Build the category tree starting from the root categories (those without a parent)
        const rootCategories = allCategories.filter((category) => !category.parentCategory);
        const categoryTree = rootCategories.map((rootCategory) => buildCategoryTree(rootCategory._id.toString()));

        // Return the result
        ResponseHandler.success(res, { categories: categoryTree }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.category_id;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            throw new CustomError(404, 'Category not found');
        }

        const categoryData = {
            id: category._id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            parentCategory: category.parentCategory,
        };

        ResponseHandler.success(res, categoryData, 200);

    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    createEditCategory,getAllCategories, getCategoryById
};
