const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

module.exports = async function seed() {
  const adminEmail = 'admin@aerotrack.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'AeroTrack Admin',
      email: adminEmail,
      password: passwordHash,
      role: 'admin',
    });
    console.log('Seeded default admin: admin@aerotrack.com / admin123');
  }

  if ((await Inventory.countDocuments()) === 0) {
    await Inventory.insertMany([
      { name: 'Titanium Alloy Sheet', sku: 'TI-6AL-4V', quantity: 120, unit: 'kg', reorderLevel: 40 },
      { name: 'Aluminum Rivets', sku: 'AL-RVT-5', quantity: 8500, unit: 'pcs', reorderLevel: 2000 },
      { name: 'Carbon Fiber Roll', sku: 'CF-ROLL-12K', quantity: 18, unit: 'rolls', reorderLevel: 6 },
      { name: 'Hydraulic Fluid', sku: 'HYD-MIL-5606', quantity: 240, unit: 'L', reorderLevel: 80 },
    ]);
    console.log('Seeded inventory items');
  }
};
