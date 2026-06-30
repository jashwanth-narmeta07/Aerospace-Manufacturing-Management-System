const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inspectorName: String,
    result: { type: String, enum: ['passed', 'failed'] },
    remarks: { type: String, default: '' },
    inspectedAt: Date,
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    component: { type: String, required: true },
    partNumber: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'passed', 'failed'],
      default: 'in_progress',
    },
    inspection: { type: inspectionSchema, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', workSchema);
