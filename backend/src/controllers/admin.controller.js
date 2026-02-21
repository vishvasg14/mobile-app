const InteractionLog = require("../models/InteractionLog");
const { successResponse } = require("../utils/response");

exports.dashboardInteractions = async (req, res, next) => {
  try {
    const sinceHoursRaw = Number(req.query.sinceHours || 24);
    const limitRaw = Number(req.query.limit || 50);
    const sinceHours = Number.isFinite(sinceHoursRaw)
      ? Math.min(Math.max(sinceHoursRaw, 1), 168)
      : 24;
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 10), 200)
      : 50;

    const sinceDate = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
    const sinceFilter = { createdAt: { $gte: sinceDate } };

    const [totals, topIps, topPaths, recent, errorCount] = await Promise.all([
      InteractionLog.countDocuments(sinceFilter),
      InteractionLog.aggregate([
        { $match: sinceFilter },
        { $group: { _id: "$ip", hits: { $sum: 1 } } },
        { $sort: { hits: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, ip: "$_id", hits: 1 } }
      ]),
      InteractionLog.aggregate([
        { $match: sinceFilter },
        { $group: { _id: "$path", hits: { $sum: 1 } } },
        { $sort: { hits: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, path: "$_id", hits: 1 } }
      ]),
      InteractionLog.find(sinceFilter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("createdAt ip method path statusCode durationMs userId userRole")
        .lean(),
      InteractionLog.countDocuments({
        ...sinceFilter,
        statusCode: { $gte: 400 }
      })
    ]);

    return successResponse({
      res,
      responseObject: {
        window: {
          sinceHours,
          from: sinceDate.toISOString(),
          to: new Date().toISOString()
        },
        totals: {
          requests: totals,
          errors: errorCount,
          success: Math.max(totals - errorCount, 0)
        },
        topIps,
        topPaths,
        recent
      }
    });
  } catch (err) {
    next(err);
  }
};
