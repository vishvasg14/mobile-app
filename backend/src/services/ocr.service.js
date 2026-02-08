const Tesseract = require("tesseract.js");

exports.extractTextFromBase64 = async (base64Image) => {
  const buffer = Buffer.from(base64Image, "base64");

  const {
    data: { text }
  } = await Tesseract.recognize(buffer, "eng");

  return text;
};
