const Work = require('../models/Work');
const User = require('../models/User');

exports.summary = async (_req, res) => {
  const works = await Work.find().sort({ createdAt: -1 });
  const users = await User.find();
  const passed = works.filter((w) => w.status === 'passed');
  const failed = works.filter((w) => w.status === 'failed');
  const inspected = passed.length + failed.length;
  const passRate = inspected ? Math.round((passed.length / inspected) * 100) : 0;

  const byEmployee = {};
  for (const w of works) {
    const k = String(w.employeeId);
    if (!byEmployee[k]) byEmployee[k] = { name: w.employeeName, total: 0, passed: 0, failed: 0 };
    byEmployee[k].total++;
    if (w.status === 'passed') byEmployee[k].passed++;
    if (w.status === 'failed') byEmployee[k].failed++;
  }

  res.json({
    works,
    counts: {
      total: works.length,
      passed: passed.length,
      failed: failed.length,
      inspected,
      passRate,
      admins: users.filter((u) => u.role === 'admin').length,
      managers: users.filter((u) => u.role === 'manager').length,
      employees: users.filter((u) => u.role === 'employee').length,
    },
    leaderboard: Object.values(byEmployee).sort((a, b) => b.passed - a.passed),
  });
};
