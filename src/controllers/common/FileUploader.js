const Media = require('../../models/Media');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const { default: mongoose } = require('mongoose');
const storage = multer.memoryStorage(); // Store files in memory (customize as needed)
const upload = multer({ storage: storage });



const uploadMediaToLibrary = async (req, res) => {
  try {
    const domainHeader = req.headers['domain'];
    upload.single('file')(req, res, async (err) => {
      if (err) {
        throw new CustomError(400, 'Error handling file upload.');
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadInfo = await handleUpload(dataURI, req.file.originalname, req);
     

      if (!uploadInfo) {
        throw new CustomError(500, 'Failed to upload one or more images to Cloudinary.');
      }

      console.log(uploadInfo, req.file.originalname);

      const uploadedMedia = {
        title: req.body.title ? req.body.title : req.file.originalname.replace(/\.[^.]*$/, ''),
        caption: req.body.caption ? req.body.caption : '',
        description: req.body.description ? req.body.description : 'upload file to hegroup',
        alt_text: req.body.alt_text ? req.body.alt_text : 'upload file to hegroup',
        filename: req.body.filename ? req.file.originalname : 'upload file to hegroup',
        cloudinary_id: uploadInfo.cloudinary_id,
        url: uploadInfo.url,
        size: (uploadInfo.size),
        width: uploadInfo.width,
        height: uploadInfo?.height,
        resource_type: uploadInfo.resource_type,
        format:uploadInfo?.format,
        storage_type: 'cloudinary',
        author: req.userId, // Ensure req.user is defined
        category: req.body.category ? req.file.category : '',
        tags: req.body.tags,
        domain: domainHeader,
      };

      const savedMedia = await Media.create(uploadedMedia);

      ResponseHandler.success(res, savedMedia, 200);
    });
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

async function handleUpload(file, originalname, req) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: req.headers['domain']
    // Include any other Cloudinary upload options if needed
  });

  return {
    cloudinary_id: res.public_id,
    url: res.secure_url,
    size: res.bytes,
    filename: originalname,
    width:  res.width,
    height:  res.height,
    resource_type:res.resource_type,
    format:res.format
  };
}


const deleteMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(media_id)) {
      throw new CustomError(400, 'Invalid media ID');
    }

    const media = await Media.findById(media_id);
    if (!media) {
      throw new CustomError(404, 'Media not found');
    }
    await cloudinary.uploader.destroy(media.cloudinary_id);
    await Media.findByIdAndDelete(media_id);

    ResponseHandler.success(res, { message: 'Media deleted successfully' }, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  uploadMediaToLibrary, deleteMedia
};
