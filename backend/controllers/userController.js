const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (!['employee', 'manager'].includes(role)) {
    return res.status(400).json({ message: 'Role must be employee or manager' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'A user with that email already exists.' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role, department });
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const target = await User.findById(id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  const { name, email, password, role, department } = req.body;
  if (email && email.toLowerCase() !== target.email) {
    const clash = await User.findOne({ email: email.toLowerCase() });
    if (clash) return res.status(409).json({ message: 'A user with that email already exists.' });
    target.email = email.toLowerCase();
  }
  if (name) target.name = name;
  if (department !== undefined) target.department = department;
  if (role && target.role !== 'admin') target.role = role;
  if (password) target.password = await bcrypt.hash(password, 10);
  await target.save();
  res.json(target);
};

exports.deleteUser = async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
  await target.deleteOne();
  res.json({ ok: true });
};
