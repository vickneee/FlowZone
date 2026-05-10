const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    // Reference to the User model
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: "" },
    completedTime: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Task", taskSchema);
