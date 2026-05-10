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

// // Add virtual field id
// taskSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     ret.id = ret._id;
//     delete ret._id; // Clean up the duplicate _id
//     return ret;
//   }
// });

module.exports = mongoose.model("Task", taskSchema);
