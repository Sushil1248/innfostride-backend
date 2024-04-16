const Media = require('../../models/Media');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const Domain = require('../../models/Domain');


const getAllDomain = async (req, res) => {
    try {
        const domains = await Domain.find(); 
        if (!domains.length) {
            throw new CustomError(404, 'Domain not found');
        }

        const domainData = domains.map((domain) => ({
            id: domain._id,
            name: domain?.name,
            title: domain?.title,
            link: domain?.link
        }));

        ResponseHandler.success(res, domainData , 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    getAllDomain,
};
