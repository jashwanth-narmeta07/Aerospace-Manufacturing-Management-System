const Inventory = require('../models/Inventory');

exports.listInventory = async (_req, res) => {
  const items = await Inventory.find().sort({ name: 1 });
  res.json(items);
};

exports.updateInventory = async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  const { quantity, reorderLevel, name, unit, sku } = req.body;
  if (quantity !== undefined) item.quantity = quantity;
  if (reorderLevel !== undefined) item.reorderLevel = reorderLevel;
  if (name) item.name = name;
  if (unit) item.unit = unit;
  if (sku) item.sku = sku;
  await item.save();
  res.json(item);
};

exports.createInventory = async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(item);
};
