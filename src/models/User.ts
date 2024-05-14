import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  chatId: {
    type: Number,
    unique: true,
  },
  username:String,
  createdAt: Date,
});

module.exports = mongoose.model("user", UserSchema);
