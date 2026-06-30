import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { PageHeader } from '../components/AppShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Activity, CheckCircle2, AlertTriangle, Factory, Package, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/works').then((r) => setWorks(r.data)).catch(() => {});
    api.get('/inventory').then((r) => setInventory(r.data)).catch(() => {});
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {});
  }, []);

  const passed = works.filter((w) => w.status === 'passed');
  const submitted = works.filter((w) => w.status === 'submitted');
  const failed = works.filter((w) => w.status === 'failed');
  const lowStock = inventory.filter((i) => i.quantity <= i.reorderLevel);
  const inspected = passed.length + failed.length;
  const passRate = inspected ? Math.round((passed.length / inspected) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} subtitle="Live operations overview across the manufacturing floor." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Production runs" value={works.length} Icon={Factory} accent="text-ocean-300" />
        <Kpi label="Awaiting inspection" value={submitted.length} Icon={Activity} accent="text-yellow-400" />
        <Kpi label="Passed inspections" value={passed.length} Icon={CheckCircle2} accent="text-emerald-400" />
        <Kpi label="Low stock items" value={lowStock.length} Icon={AlertTriangle} accent="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Recently passed inspections</h2>
              <p className="text-xs text-ocean-100">Certified assemblies signed off by managers.</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl font-semibold text-emerald-400">{passRate}%</div>
              <div className="text-[10px] uppercase tracking-wider text-ocean-100">Pass rate</div>
            </div>
          </div>
          {passed.length === 0 ? (
            <Empty Icon={ShieldCheck} title="No certifications yet" hint="Once a manager passes an inspection, it'll appear here." />
          ) : (
            <ul className="divide-y divide-ocean-800">
              {passed.slice(0, 6).map((w) => (
                <li key={w._id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{w.component}</div>
                    <div className="text-xs text-ocean-100 font-mono">{w.partNumber} · qty {w.quantity} · {w.employeeName}</div>
                  </div>
                  <span className="pill bg-emerald-500/10 text-emerald-300">
                    <CheckCircle2 className="size-3" /> Passed
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold mb-1">Inventory health</h2>
          <p className="text-xs text-ocean-100 mb-4">Items at or below reorder level.</p>
          {lowStock.length === 0 ? (
            <Empty Icon={Package} title="All stocks healthy" hint="No items below reorder threshold." />
          ) : (
            <ul className="space-y-3">
              {lowStock.map((i) => (
                <li key={i._id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{i.name}</div>
                    <div className="text-[10px] font-mono text-ocean-100">{i.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold text-red-400">{i.quantity} {i.unit}</div>
                    <div className="text-[10px] text-ocean-100">reorder {i.reorderLevel}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold mb-4">Activity feed</h2>
          {works.length === 0 ? (
            <Empty Icon={Activity} title="No activity yet" hint="Production updates will stream here in real time." />
          ) : (
            <ul className="space-y-3">
              {works.slice(0, 8).map((w) => (
                <li key={w._id} className="flex items-center gap-3 text-sm">
                  <span className={`size-2 rounded-full ${w.status === 'passed' ? 'bg-emerald-400' : w.status === 'failed' ? 'bg-red-400' : w.status === 'submitted' ? 'bg-yellow-400' : 'bg-ocean-300'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{w.employeeName}</span>{' '}
                    <span className="text-ocean-100">updated</span>{' '}
                    <span className="font-mono">{w.partNumber}</span>
                  </div>
                  <div className="text-xs text-ocean-100 capitalize">{w.status.replace('_', ' ')}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Team</h2>
          <ul className="space-y-2 text-sm">
            <Row label="Admins" value={users.filter((u) => u.role === 'admin').length} />
            <Row label="Managers" value={users.filter((u) => u.role === 'manager').length} />
            <Row label="Employees" value={users.filter((u) => u.role === 'employee').length} />
            <Row label="Failed runs" value={failed.length} tone="red" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, Icon, accent }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-ocean-100">{label}</div>
        <Icon className={`size-4 ${accent}`} />
      </div>
      <div className="font-display text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function Empty({ Icon, title, hint }) {
  return (
    <div className="text-center py-10">
      <Icon className="size-8 mx-auto text-ocean-100/60" />
      <div className="mt-3 font-medium">{title}</div>
      <div className="text-xs text-ocean-100 mt-1">{hint}</div>
    </div>
  );
}

function Row({ label, value, tone }) {
  return (
    <li className="flex items-center justify-between border-b border-ocean-800/50 pb-2 last:border-0">
      <span className="text-ocean-100">{label}</span>
      <span className={`font-mono font-semibold ${tone === 'red' ? 'text-red-400' : ''}`}>{value}</span>
    </li>
  );
}
