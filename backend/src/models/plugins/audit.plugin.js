module.exports = function auditPlugin(schema) {
  schema.add({
    createdBy: {
      type: String,
      required: false,
      index: true
    },
    updatedBy: {
      type: String,
      required: false
    }
  });

  schema.pre("save", function () {
    if (this.isNew && this._userId) {
      this.createdBy = this._userId;
      this.updatedBy = this._userId;
    } else if (this._userId) {
      this.updatedBy = this._userId;
    }
  });

  schema.pre(["updateOne", "findOneAndUpdate"], function () {
    if (this.options._userId) {
      this.set({ updatedBy: this.options._userId });
    }
  });
};
