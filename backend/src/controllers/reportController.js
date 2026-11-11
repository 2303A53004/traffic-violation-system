const Violation = require("../models/Violation");

exports.byCategory = async (req, res) => {
  const data = await Violation.aggregate([
    { $group: { _id: "$category", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, category: "$_id", total: 1 } },
  ]);
  res.json(data);
};

exports.pending = async (req, res) => {
  const data = await Violation.find({ status: { $nin: ["Resolved", "Rejected"] } })
    .select("title category status location.area createdAt")
    .sort({ createdAt: 1 });
  res.json(data);
};

exports.byArea = async (req, res) => {
  const data = await Violation.aggregate([
    {
      $group: {
        _id: "$location.area",
        total: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
    { $project: { _id: 0, area: "$_id", total: 1, resolved: 1 } },
  ]);
  res.json(data);
};

exports.resolution = async (req, res) => {
  const byStatus = await Violation.aggregate([
    { $group: { _id: "$status", total: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", total: 1 } },
  ]);
  const byOfficer = await Violation.aggregate([
    { $match: { officer: { $ne: null } } },
    {
      $group: {
        _id: "$officer",
        assigned: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
      },
    },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "o" } },
    { $unwind: "$o" },
    { $project: { _id: 0, officer: "$o.name", assigned: 1, resolved: 1 } },
  ]);
  res.json({ byStatus, byOfficer });
};
