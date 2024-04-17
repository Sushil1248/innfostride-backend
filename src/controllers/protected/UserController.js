const jwt = require('jsonwebtoken');
const fs = require('fs');
const handlebars = require('handlebars');

const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');
const bcrypt = require('bcrypt');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const sendMail = require('../../utils/sendMail');
const { generateRandomString } = require('../auth/authController');
const path = require('path');
const Sidebar = require('../../models/Sidebar');
const getAppLogoMarkup = require('../../utils/helper');
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId).populate('role').populate('permissions');
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      bio: user.bio|| '',
      profile_pic: user.profile_pic || '',
      lastName: user.lastName,
      roles: user.role?.name,
      permissions: user.permissions.map(({ name, module }) => ({ name, module }))
    };
      console.log(userProfile);
    ResponseHandler.success(res, userProfile, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    user.staySignedIn = false;
    user.save();

    ResponseHandler.success(res, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const sendOtpVerificationOnEmail = async (req, res) => {
  try {
    const { email, form_type, verification_code } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Generate OTP here
    const otp = generateRandomString(6); // You need to implement generateOTP function

    if (form_type == 'send_mail') {
      try {
        const templateFilePath = path.join(__dirname, '..', '..', 'email-templates', 'send-verification-code.hbs');
        const templateFile = fs.readFileSync(templateFilePath, 'utf8');
        const template = handlebars.compile(templateFile);
        const app_logo = `${process.env.APP_LOGO_PATH}`
        const app_name = process.env.APP_NAME;

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account Verification Email',
          html: template({ otp, app_logo, app_name })
        };

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();
        console.log(user);

        // Send email
        sendMail(mailOptions)
          .then(async () => {
            ResponseHandler.success(res, { email_sent: true, otp: otp, message: "Verification code sent successfully" }, HTTP_STATUS_CODES.OK);
          })
          .catch((error) => {
            ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { field_error: 'email', email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
          });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    } else {
      console.log(verification_code, user.otp);
      if (verification_code !== user.otp) {
        ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'verification_code', message: "Invalid or expired verification code. Please verify your email again!" }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
      } else {
        user.otp = otp;
        user.save();
        ResponseHandler.success(res, { verified: true, message: "Email verified successfully" }, HTTP_STATUS_CODES.OK);
      }
    }

  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const checkPassword = async (req, res) => {
  try {
    const { password } = req.body; // Assuming the password is sent in the request body

    // Extracting the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'password', message: "Your password seems incorrect! Please try again." }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
    }

    // If passwords match, return a success response
    ResponseHandler.success(res, { message: 'Password is correct' }, 200);
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};

const saveSidebarData = async (req, res) => {
  try {
    const jsonData = req.body;
    const jsonString = JSON.stringify(jsonData, null, 2);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Check if a sidebar with the same userId exists
    const existingSidebar = await Sidebar.findOne({ userId });

    if (existingSidebar) {
      // If sidebar with same userId exists, update its items
      existingSidebar.items = jsonString;
      await existingSidebar.save();

      ResponseHandler.success(res, { message: 'Sidebar Updated Successfully', sidebar: JSON.parse(existingSidebar.items[0]) }, HTTP_STATUS_CODES.OK);
    } else {
      // If sidebar with userId doesn't exist, create a new sidebar object
      const sidebar = new Sidebar({
        userId: userId,
        items: jsonString
      });

      // Save the Sidebar object to the database
      await sidebar.save();

      ResponseHandler.success(res, { message: 'Sidebar Created Successfully', sidebar: JSON.parse(sidebar.items[0]) }, HTTP_STATUS_CODES.CREATED);
    }
  } catch (error) {
    ResponseHandler.error(res, HTTP_STATUS_CODES.BAD_REQUEST, error.message, HTTP_STATUS_CODES.BAD_REQUEST);
  }
};


const getSidebarData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const sidebar = await Sidebar.findOne({ userId });

    ResponseHandler.success(res, { sidebar }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    // Handle errors
    console.error('Error fetching sidebar data:', error);
    ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};


module.exports = {
  getProfile, checkPassword, sendOtpVerificationOnEmail, logout, getSidebarData, saveSidebarData
};
