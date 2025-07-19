const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    try {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
      this.setUpdate(update);
    } catch (err) {
      return next(err);
    }
  }
  next();
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