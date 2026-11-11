const Violation = require("../models/Violation");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.create = async (req, res) => {
  try {
    const { title, category, description, vehicleNumber, lat, lng, area } = req.body;
    if (!title || !category || !area)
      return res.status(400).json({ message: "title, category and area are required" });
    const evidence = (req.files || []).map((f) => "/uploads/" + f.filename);
    if (evidence.length === 0)
      return res.status(400).json({ message: "At least one evidence image is required" });

    const violation = await Violation.create({
      title,
      category,
      description,
      vehicleNumber,
      evidence,
      location: {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        area,
      },
      reportedBy: req.user.id,
      history: [{ status: "Submitted", note: "Report submitted", by: req.user.id }],
    });
    res.status(201).json(violation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { search, category, area, status, from, to } = req.query;
    const filter = {};

    if (req.user.role === "citizen") filter.reportedBy = req.user.id;
    if (req.user.role === "officer") filter.officer = req.user.id;

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (area) filter["location.area"] = new RegExp(escapeRegex(area), "i");
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: rx }, { vehicleNumber: rx }, { description: rx }];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const items = await Violation.find(filter)
      .populate("reportedBy", "name email")
      .populate("officer", "name")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const v = await Violation.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("reviewer", "name")
      .populate("officer", "name")
      .populate("history.by", "name role");
    if (!v) return res.status(404).json({ message: "Violation not found" });
    if (req.user.role === "citizen" && String(v.reportedBy._id) !== req.user.id)
      return res.status(403).json({ message: "Not your report" });
    if (req.user.role === "officer" && (!v.officer || String(v.officer._id) !== req.user.id))
      return res.status(403).json({ message: "Not assigned to you" });
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.review = async (req, res) => {
  try {
    const { decision, note } = req.body;
    if (!["validate", "reject"].includes(decision))
      return res.status(400).json({ message: "decision must be validate or reject" });
    const v = await Violation.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Violation not found" });
    if (!["Submitted", "Under Review"].includes(v.status))
      return res.status(400).json({ message: "Report already reviewed" });

    v.status = decision === "validate" ? "Validated" : "Rejected";
    v.reviewer = req.user.id;
    v.history.push({ status: v.status, note: note || "", by: req.user.id });
    await v.save();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { officerId, note } = req.body;
    const v = await Violation.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Violation not found" });
    if (!["Validated", "Assigned"].includes(v.status))
      return res.status(400).json({ message: "Only validated cases can be assigned" });

    v.officer = officerId;
    v.status = "Assigned";
    v.history.push({ status: "Assigned", note: note || "Assigned to officer", by: req.user.id });
    await v.save();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!["In Progress", "Resolved"].includes(status))
      return res.status(400).json({ message: "status must be In Progress or Resolved" });
    const v = await Violation.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Violation not found" });
    if (req.user.role === "officer" && String(v.officer) !== req.user.id)
      return res.status(403).json({ message: "Not assigned to you" });
    if (!["Assigned", "In Progress"].includes(v.status))
      return res.status(400).json({ message: "Case is not in an actionable state" });

    v.status = status;
    v.history.push({ status, note: note || "", by: req.user.id });
    await v.save();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
