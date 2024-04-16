const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const mongoose = require('mongoose');
const NavigationItem = require('../../models/NavigationItem');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const Domain = require('../../models/Domain');

const getDomainNameById = async (domainId) => {
    try {
        const domain = await Domain.findById(domainId);
        return domain ? domain.name : null;
    } catch (error) {
        // Handle error (e.g., log it or throw a specific error)
        console.error('Error getting domain name by ID:', error);
        return null;
    }
};


const createEditNavigationItem = async (req, res) => {
    try {
        const { id } = req.body;
        const domainHeader = req.headers['domain'];
        const domain = await Domain.findOne({ name: domainHeader });
        const domain_id = domain ? domain._id : null;

        const { label, route, enabled, imgUrl, category, subcategory, type } = req.body;
        const navigationItemObject = {
            domain_id,
            label,
            route,
            type,
            enabled: enabled,
            imgUrl,
            category: category,
        };

        let navigationItem;

        if (mongoose.Types.ObjectId.isValid(id)) {
            navigationItem = await NavigationItem.findById(id);
            if (!navigationItem) {
                throw new CustomError(404, 'NavigationItem not found');
            }
        } else {
            navigationItem = new NavigationItem(navigationItemObject);
        }

        // Update or set fields based on the request body
        navigationItem.label = label || navigationItem.label;
        navigationItem.route = route || navigationItem.route;
        navigationItem.type = type || navigationItem.type;
        navigationItem.enabled = enabled || navigationItem.enabled;
        navigationItem.imgURL = imgUrl || navigationItem.imgURL;
        if(category == true){
            navigationItem.category = true ;
        }else{
            navigationItem.category = false ;
        }
       


        let updatedNavigationItem = await navigationItem.save();
        updatedNavigationItem = { ...updatedNavigationItem.toObject(), id: updatedNavigationItem._id };

        ResponseHandler.success(res, { navigationItem: updatedNavigationItem }, mongoose.Types.ObjectId.isValid(id) ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const transformNavigationItems = async (navigationItems) => {
    const resultArray = [];

    for (const item of navigationItems) {
        const domainName = await getDomainNameById(item.domain_id);

        if (!domainName) {
            // Handle the case where domainName is not available
            console.error('Domain name not found for domain_id:', item.domain_id);
            continue;
        }

        const transformedItem = {
            imgURL: item.imgURL,
            route: item.route,
            label: item.label,
            type: item.type,
            category: item.category
        };
        console.log(transformedItem)
        if (item.subcategory && item.subcategory.length > 0) {
            transformedItem.subcategory = item.subcategory.map(subItem => ({
                imgURL: subItem.imgURL,
                route: subItem.route,
                label: subItem.label,
                type: subItem.type,
            }));
        }

        const domainIndex = resultArray.findIndex(entry => entry[0] === domainName);
        if (domainIndex === -1) {
            resultArray.push([domainName, [transformedItem]]);
        } else {
            resultArray[domainIndex][1].push(transformedItem);
        }
    }

    return resultArray.map(([domainName, items]) => ({ [domainName]: items }));
};

const getAllNavigationItems = async (req, res) => {
    try {
        const domainHeader = req.headers['domain'];
        const domain = await Domain.findOne({ name: domainHeader });
        const domain_id = domain ? domain._id : null;
        const allNavigationItems = await NavigationItem.find().where('domain_id', domain_id).sort({ label: 1 });
        ResponseHandler.success(res, { navigationItems: allNavigationItems }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getNavigationItemById = async (req, res) => {
    try {
        const navigationItemId = req.params.navigation_item_id;
        if (!mongoose.Types.ObjectId.isValid(navigationItemId)) {
            throw new CustomError(400, 'Invalid navigation item ID');
        }

        const navigationItem = await NavigationItem.findById(navigationItemId);
        if (!navigationItem) {
            throw new CustomError(404, 'NavigationItem not found');
        }

        const navigationItemData = {
            id: navigationItem._id,
            domain_id: navigationItem.domain_id,
            label: navigationItem.label,
            route: navigationItem.route,
            enabled: navigationItem.enabled,
            imgURL: navigationItem.imgURL,
            category: navigationItem.category,
            subcategory: navigationItem.subcategory,
        };

        ResponseHandler.success(res, navigationItemData, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


const quickEditNavItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        const navigationItem = await NavigationItem.findById(id);

        if (!navigationItem) {
            throw new CustomError(404, 'Post not found');
        }
        
        if (enabled == false) {
            navigationItem.enabled = false;
        }else{
            navigationItem.enabled = true;
        }

        await navigationItem.save();

        ResponseHandler.success(res, { message: 'Navigation Item updated successfully' }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    createEditNavigationItem, getNavigationItemById,
    getAllNavigationItems, quickEditNavItem
};

