const { v4: uuid } = require("uuid");

exports.generatePublicCode = () => uuid().slice(0, 8);
