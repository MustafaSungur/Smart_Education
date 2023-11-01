const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strick: true,
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
