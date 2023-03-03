const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, require: true },
  imageUrl: { type: String, require: true },
  content: { type: String, require: true },
  dateCreate: { type: Date, rerequire: true },
  user: {
    _id: { type: Schema.Types.ObjectId, require: true },
    name: { type: String, require: true },
  },
});

module.exports = mongoose.model("Post", PostSchema);
