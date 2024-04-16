const User = require('../../models/User');
const { CustomError } = require('../utils/responseHandler');

class UserProfileRepository {
  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return userProfile;
  }
}

module.exports = UserProfileRepository;
