var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TopSchema = new Schema({
  id: { type: Number, default: 1 },
  top: [],
});

var Top = mongoose.model("top", TopSchema);

module.exports = Top;
