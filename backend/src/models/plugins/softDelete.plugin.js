module.exports = function softDeletePlugin(schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: String,
      default: null
    }
  });

  schema.pre(/^find/, function () {
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    }
  });
};
