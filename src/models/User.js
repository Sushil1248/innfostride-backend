const mongoose = require('mongoose');

// User schema currently set to default....
// will be adding more fields whenever new requirement comes
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile_pic: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  department: { type: String },
  emp_code: { type: String },
  bio: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  otp: { type: String },
  resetToken: { type: String },
  otpExpiry: { type: Date },
  resetTokenExpiry: { type: Date },
  staySignedIn: { type: Boolean, default: false }, // Whether the user has opted to stay signed in for 7 days
  signInTimestamp: { type: Date }, // Timestamp when the user signed in
  incorrectAttempts: { type: Number, default: 0 },
  lastIncorrectNotificationAttempt: { type: Number, default: 0 },
  login_expired_till: { type: Date, default: null, nullable: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;