const Card = require("../models/Card");
const { extractTextFromBase64 } = require("../services/ocr.service");
const { categorize } = require("../services/nlp.service");
const { parseContactInfo } = require("../utils/textParser");
const { generatePublicCode } = require("../utils/publicCode");
const { successResponse } = require("../utils/response");

exports.ingestCard = async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return successResponse({
        res,
        responseCode: 400,
        responseMessage: "Image is required"
      });
    }

    const rawText = await extractTextFromBase64(imageBase64);
    const parsed = parseContactInfo(rawText);
    const category = categorize(rawText);

    const card = new Card({
      userId: req.user.id,
      rawText,
      category,
      ...parsed
    });

    card._userId = req._userId;
    await card.save();

    return successResponse({
      res,
      responseCode: 201,
      responseMessage: "Card created successfully",
      responseObject: card
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyCards = async (req, res) => {
  const cards = await Card.find({ userId: req.user.id }).sort("-createdAt");

  return successResponse({
    res,
    responseObject: cards,
    pageSize: cards.length
  });
};

exports.getMyCardById = async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });

  if (!card) {
    return successResponse({
      res,
      responseCode: 404,
      responseMessage: "Card not found"
    });
  }

  return successResponse({
    res,
    responseObject: card
  });
};

exports.togglePublic = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });

    if (!card) {
      return successResponse({ res, responseCode: 404, responseMessage: "Card not found" });
    }

    card.isPublic = !card.isPublic;
    if (card.isPublic && !card.publicCode) {
      card.publicCode = generatePublicCode();
    }
    if (!card.isPublic) {
      card.publicCode = null;
    }

    await card.save();

    return successResponse({ res, responseObject: card, responseMessage: "Card updated" });
  } catch (err) {
    next(err);
  }
};

exports.updateCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });

    if (!card) {
      return successResponse({ res, responseCode: 404, responseMessage: "Card not found" });
    }

    const allowed = ["name", "email", "phone", "company", "category"];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        card[key] = req.body[key];
      }
    }

    await card.save();

    return successResponse({ res, responseObject: card, responseMessage: "Card updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.id });

    if (!card) {
      return successResponse({ res, responseCode: 404, responseMessage: "Card not found" });
    }

    card.isDeleted = true;
    card.deletedAt = new Date();
    card.deletedBy = req.user.id;

    await card.save();

    return successResponse({ res, responseMessage: "Card deleted" });
  } catch (err) {
    next(err);
  }
};

exports.adminGetAllCards = async (req, res) => {
  const cards = await Card.find({}).sort("-createdAt");

  return successResponse({ res, responseObject: cards, pageSize: cards.length });
};

exports.getPublicCard = async (req, res) => {
  const card = await Card.findOne({ publicCode: req.params.code, isPublic: true });

  if (!card) {
    return successResponse({ res, responseCode: 404, responseMessage: "Card not found" });
  }

  return successResponse({ res, responseObject: card });
};
