const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.statics.createUser = function (userData) {
  return this.create(userData);
};

userSchema.statics.getAllUsers = function () {
  return this.find().select("-password");
};

userSchema.statics.getUserById = function (id) {
  return this.findById(id).select("-password");
};

userSchema.statics.updateUserById = function (id, updateData) {
  return this.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");
};

userSchema.statics.deleteUserById = function (id) {
  return this.findByIdAndDelete(id);
};

const User = mongoose.model("User", userSchema);

module.exports = User;