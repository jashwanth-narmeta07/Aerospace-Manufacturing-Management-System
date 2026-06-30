import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import api from '../lib/api.js';
import { PageHeader } from '../components/AppShell.jsx';
import { StatusPill } from '../data/processes.jsx';

export default function Reports() {
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [range, setRange] = useState('month');
  const [bucket, setBucket] = useState('__current__');

  useEffect(() => {
    api.get('/works').then((r) => setWorks(r.data)).catch(() => {});
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {});
  }, []);

  const buckets = useMemo(() => {
    const set = new Set();
    for (const w of works) {
      const d = new Date(w.createdAt);
      if (range === 'day') set.add(d.toISOString().slice(0, 10));
      else if (range === 'month') set.add(d.toISOString().slice(0, 7));
      else if (range === 'year') set.add(String(d.getFullYear()));
    }
    const arr = Array.from(set).sort().reverse();
    const now = new Date();
    const cur = range === 'day' ? now.toISOString().slice(0, 10) : range === 'month' ? now.toISOString().slice(0, 7) : String(now.getFullYear());
    if (range !== 'all' && !arr.includes(cur)) arr.unshift(cur);
    return arr;
  }, [works, range]);

  const activeBucket = range === 'all' ? null : (bucket === '__current__' || !buckets.includes(bucket) ? buckets[0] : bucket);

  const matches = (w) => {
    if (range === 'all' || !activeBucket) return true;
    const d = new Date(w.createdAt);
    if (range === 'day') return d.toISOString().slice(0, 10) === activeBucket;
    if (range === 'month') return d.toISOString().slice(0, 7) === activeBucket;
    if (range === 'year') return String(d.getFullYear()) === activeBucket;
    return true;
  };
  const filtered = works.filter(matches);
  const passed = filtered.filter((w) => w.status === 'passed');
  const failed = filtered.filter((w) => w.status === 'failed');
  const inspected = passed.length + failed.length;
  const passRate = inspected ? Math.round((passed.length / inspected) * 100) : 0;

  const byEmployee = new Map();
  for (const w of filtered) {
    const cur = byEmployee.get(String(w.employeeId)) ?? { name: w.employeeName, total: 0, passed: 0, failed: 0 };
    cur.total++;
    if (w.status === 'passed') cur.passed++;
    if (w.status === 'failed') cur.failed++;
    byEmployee.set(String(w.employeeId), cur);
  }
  const leaderboard = Array.from(byEmployee.entries()).sort((a, b) => b[1].passed - a[1].passed);

  const fmt = (b) => {
    if (range === 'day') return new Date(b).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (range === 'month') { const [y,m] = b.split('-').map(Number); return new Date(y, m-1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); }
    return b;
  };
  const periodLabel = range === 'all' ? 'All time' : activeBucket ? fmt(activeBucket) : '—';

  const exportCsv = () => {
    const rows = [
      ['Component','Part Number','Quantity','Employee','Status','Inspector','Result','Inspected At','Remarks'],
      ...filtered.map((w) => [w.component,w.partNumber,w.quantity,w.employeeName,w.status,w.inspection?.inspectorName ?? '',w.inspection?.result ?? '',w.inspection?.inspectedAt ?? '',w.inspection?.remarks ?? '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerotrack-report-${range}-${range === 'all' ? 'all' : activeBucket}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader
        title="Reports"
        subtitle={`Production output for ${periodLabel.toLowerCase()}.`}
        actions={<button className="btn-outline" onClick={exportCsv}><Download className="size-4" /> Export CSV</button>}
      />

      <div className="panel p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="label">Group by</label>
          <select className="input mt-1" value={range} onChange={(e) => { setRange(e.target.value); setBucket('__current__'); }}>
            <option value="day">Day</option><option value="month">Month</option><option value="year">Year</option><option value="all">All time</option>
          </select>
        </div>
        {range !== 'all' && (
          <div className="flex-1">
            <label className="label">Period</label>
            <select className="input mt-1" value={activeBucket || ''} onChange={(e) => setBucket(e.target.value)}>
              {buckets.map((b) => <option key={b} value={b}>{fmt(b)}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total runs" value={filtered.length} />
        <Stat label="Inspected" value={inspected} />
        <Stat label="Passed" value={passed.length} tone="emerald" />
        <Stat label="Pass rate" value={`${passRate}%`} tone="ocean" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Employee performance</h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-ocean-100">No work entries in this period.</p>
          ) : (
            <ul className="space-y-3">
              {leaderboard.map(([id, row]) => {
                const rate = row.passed + row.failed ? Math.round((row.passed / (row.passed + row.failed)) * 100) : 0;
                return (
                  <li key={id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{row.name}</span>
                      <span className="font-mono text-ocean-100">{row.passed}/{row.total} · {rate}%</span>
                    </div>
                    <div className="h-2 bg-ocean-950 rounded-full overflow-hidden">
                      <div className="h-full bg-ocean-300" style={{ width: `${rate}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Certified assemblies</h2>
          {passed.length === 0 ? (
            <p className="text-sm text-ocean-100">Passed inspections will be listed here.</p>
          ) : (
            <ul className="divide-y divide-ocean-800">
              {passed.slice(0, 10).map((w) => (
                <li key={w._id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{w.component}</div>
                    <div className="font-mono text-[10px] text-ocean-100">{w.partNumber} · cert. by {w.inspection?.inspectorName}</div>
                  </div>
                  <StatusPill status={w.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel p-5 mt-6">
        <h2 className="font-display text-lg font-semibold mb-2">Workforce summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {['admin','manager','employee'].map((r) => (
            <div key={r} className="border border-ocean-800 rounded-md p-3">
              <div className="text-[10px] uppercase tracking-wider text-ocean-100">{r}s</div>
              <div className="font-display text-2xl font-semibold mt-1">{users.filter((u) => u.role === r).length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === 'emerald' ? 'text-emerald-400' : tone === 'ocean' ? 'text-ocean-300' : '';
  return (
    <div className="panel p-5">
      <div className="text-xs uppercase tracking-wider text-ocean-100">{label}</div>
      <div className={`font-display text-3xl font-semibold mt-2 ${color}`}>{value}</div>
    </div>
  );
}
