const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = async (buffer, originalname) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(buffer.toString('base64'));

    // Extract relevant information
    const { public_id, secure_url } = result;
    const size = buffer.length;

    return {
      cloudinary_id: public_id,
      url: secure_url,
      size,
      filename: originalname,
    };
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary: ' + error.message);
  }
};

const getAppLogoMarkup = (img_path) => {
  console.log(img_path)
  return `
    <div style="display:flex; justify-content:center; ">
      <img src="${img_path}" alt="hegroup-logo" />
      <h1 class="text-white font-inter text-md" style="color:white; font-size:14px; margin-left:4px;">HE GROUP</h1>
    </div>
  `;
};

module.exports = getAppLogoMarkup;
