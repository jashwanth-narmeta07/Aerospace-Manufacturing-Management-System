const Work = require('../models/Work');

exports.listWorks = async (req, res) => {
  const filter = {};
  if (req.user.role === 'employee') filter.employeeId = req.user._id;
  const works = await Work.find(filter).sort({ createdAt: -1 });
  res.json(works);
};

exports.createWork = async (req, res) => {
  const { component, partNumber, quantity, notes } = req.body;
  if (!component || !partNumber || !quantity) return res.status(400).json({ message: 'Missing fields' });
  const work = await Work.create({
    employeeId: req.user._id,
    employeeName: req.user.name,
    component,
    partNumber,
    quantity,
    notes: notes || '',
    status: 'in_progress',
  });
  res.status(201).json(work);
};

exports.submitWork = async (req, res) => {
  const work = await Work.findById(req.params.id);
  if (!work) return res.status(404).json({ message: 'Work not found' });
  if (String(work.employeeId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  work.status = 'submitted';
  await work.save();
  res.json(work);
};

exports.inspectWork = async (req, res) => {
  const { result, remarks } = req.body;
  if (!['passed', 'failed'].includes(result)) return res.status(400).json({ message: 'Invalid result' });
  const work = await Work.findById(req.params.id);
  if (!work) return res.status(404).json({ message: 'Work not found' });
  work.status = result;
  work.inspection = {
    inspectedBy: req.user._id,
    inspectorName: req.user.name,
    result,
    remarks: remarks || '',
    inspectedAt: new Date(),
  };
  await work.save();
  res.json(work);
};

exports.updateInspectionNotes = async (req, res) => {
  const { remarks } = req.body;
  const work = await Work.findById(req.params.id);
  if (!work || !work.inspection) return res.status(404).json({ message: 'No inspection to update' });
  work.inspection.remarks = remarks || '';
  work.inspection.inspectedBy = req.user._id;
  work.inspection.inspectorName = req.user.name;
  work.inspection.inspectedAt = new Date();
  await work.save();
  res.json(work);
};
