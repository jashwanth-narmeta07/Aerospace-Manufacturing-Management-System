// Process catalog mirrored from the original AeroTrack app.
export const PROCESSES = [
  {
    id: 'component_assembly',
    name: 'Component Assembly',
    description: 'Manage assembly of aircraft components — machining, welding, composite layup with QA at each stage.',
    stages: [
      { name: 'Initial Planning', tasks: ['Define Component Requirements','Create Production Schedule','Allocate Resources','Review Safety Compliance','Communicate Plan to Team'] },
      { name: 'Machining', tasks: ['Setup Machining Equipment','Machine Component','Inspect Machined Parts','Record Measurements','Adjust Machining Parameters'] },
      { name: 'Welding', tasks: ['Prepare Welding Area','Weld Components','Inspect Weld Quality','Perform Non-destructive Testing','Document Welding Process'] },
      { name: 'Composite Layup', tasks: ['Prepare Molds and Tools','Layup Composite Materials','Cure Composite','Inspect Composite Quality','Log Material Usage'] },
      { name: 'Quality Assurance', tasks: ['Perform Dimensional Checks','Conduct Functional Tests','Review Inspection Results','Document Quality Report','Approve or Reject Components'] },
      { name: 'Assembly Completion', tasks: ['Assemble Final Components','Final Inspection','Complete Documentation','Prepare Shipment','Send Completion Notification'] },
    ],
  },
  {
    id: 'quality_inspection',
    name: 'Quality Inspection',
    description: 'Standardize inspections at every stage of component assembly.',
    stages: [
      { name: 'Component Receipt', tasks: ['Record Component Details','Verify Documentation','Check Quality Standards','Tag Component','Route to Inspection'] },
      { name: 'In-Process Inspection', tasks: ['Conduct Inspections','Evaluate Standards','Capture Measurements','Flag Deviations','Notify Supervisor'] },
      { name: 'Final Inspection', tasks: ['Perform Final Check','Verify Tolerances','Sign-off Quality','Generate Certificate','Release Component'] },
      { name: 'Defect Resolution', tasks: ['Log Defect','Assign Owner','Apply Corrective Action','Re-inspect','Close Finding'] },
    ],
  },
  {
    id: 'inventory_management',
    name: 'Inventory Management',
    description: 'Track raw materials and components to keep manufacturing continuous.',
    stages: [
      { name: 'Inventory Intake', tasks: ['Collect Inventory Details','Verify Supplier Docs','Inspect Packaging','Record Quantities','Tag Lot Number'] },
      { name: 'Quality Check', tasks: ['Quality Assessment','Check Quality Standards','Sample Testing','Approve Lot','Quarantine Rejected Stock'] },
      { name: 'Storage Management', tasks: ['Assign Storage Locations','Update Bin Map','Apply Handling Rules','Set Reorder Levels','Log Movements'] },
      { name: 'Inventory Tracking', tasks: ['Check Stock Levels','Reconcile Counts','Trigger Reorders','Report Shortages','Audit Inventory'] },
    ],
  },
  {
    id: 'machine_maintenance',
    name: 'Machine Maintenance',
    description: 'Schedule and manage regular maintenance to minimize downtime.',
    stages: [
      { name: 'Maintenance Intake', tasks: ['Collect Machine Details','Assess Maintenance Need','Prioritize Request','Schedule Window','Notify Operators'] },
      { name: 'Parts and Tools Preparation', tasks: ['Gather Parts and Tools','Check Special Tools Required','Reserve Components','Stage Equipment','Verify Safety Gear'] },
      { name: 'Maintenance Execution', tasks: ['Assign Task','Lockout / Tagout','Perform Maintenance','Test Machine','Restore Production'] },
      { name: 'Post-Maintenance Review', tasks: ['Document Work Performed','Update Maintenance Log','Review Performance','Schedule Next Service','Close Work Order'] },
    ],
  },
  {
    id: 'defect_tracking',
    name: 'Defect Tracking',
    description: 'Track defects, initiate root cause analysis and corrective actions.',
    stages: [
      { name: 'Defect Identification', tasks: ['Collect Defect Details','Photograph Defect','Evaluate Immediate Action','Notify Quality','Log Case'] },
      { name: 'Defect Analysis', tasks: ['Root Cause Analysis','Review Process Data','Interview Operators','Classify Defect','Document Findings'] },
      { name: 'Corrective Action', tasks: ['Define Corrective Actions','Assign Owner','Implement Fix','Update Procedures','Train Team'] },
      { name: 'Validation', tasks: ['Re-run Process','Inspect Output','Evaluate Effectiveness','Approve Closure','Archive Case'] },
    ],
  },
];

export const STATUS_STYLES = {
  in_progress: 'bg-ocean-500/20 text-ocean-300',
  submitted: 'bg-yellow-500/15 text-yellow-300',
  passed: 'bg-emerald-500/15 text-emerald-300',
  failed: 'bg-red-500/15 text-red-300',
};

export function StatusPill({ status }) {
  return <span className={`pill ${STATUS_STYLES[status] || ''}`}>{String(status).replace('_', ' ')}</span>;
}
