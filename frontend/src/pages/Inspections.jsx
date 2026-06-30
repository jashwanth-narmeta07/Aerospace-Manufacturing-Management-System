import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import api from '../lib/api.js';
import { PageHeader } from '../components/AppShell.jsx';
import { Modal, useModal } from '../components/Modal.jsx';
import { StatusPill } from '../data/processes.jsx';

const TABS = [
  { key: 'queue', label: 'Queue', status: 'submitted' },
  { key: 'passed', label: 'Passed', status: 'passed' },
  { key: 'failed', label: 'Failed', status: 'failed' },
];

export default function Inspections() {
  const [works, setWorks] = useState([]);
  const [tab, setTab] = useState('queue');

  const refresh = () => api.get('/works').then((r) => setWorks(r.data));
  useEffect(() => { refresh(); }, []);

  const counts = Object.fromEntries(TABS.map((t) => [t.key, works.filter((w) => w.status === t.status).length]));
  const active = TABS.find((t) => t.key === tab);
  const items = works.filter((w) => w.status === active.status);

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader title="Inspections" subtitle="Review submitted work and certify outcomes." />

      <div className="flex gap-2 mb-4 border-b border-ocean-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${tab === t.key ? 'border-ocean-300 text-ocean-300' : 'border-transparent text-ocean-100 hover:text-ocean-50'}`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="panel p-12 text-center">
          <ShieldCheck className="size-8 mx-auto text-ocean-100/60" />
          <div className="mt-3 font-medium">
            {tab === 'queue' ? 'No items awaiting inspection.' : tab === 'passed' ? 'No passed inspections yet.' : 'No failed inspections.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((w) => (
            <div key={w._id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display text-lg font-semibold truncate">{w.component}</div>
                  <div className="font-mono text-xs text-ocean-100 mt-0.5">{w.partNumber} · qty {w.quantity}</div>
                </div>
                <StatusPill status={w.status} />
              </div>
              <div className="mt-3 text-sm text-ocean-100">
                Logged by <span className="text-ocean-50 font-medium">{w.employeeName}</span> · {new Date(w.createdAt).toLocaleString()}
              </div>
              {w.notes && <div className="mt-3 text-sm bg-ocean-950/60 rounded-md p-3 border border-ocean-800">{w.notes}</div>}
              {w.inspection && (
                <div className="mt-3 text-sm border-t border-ocean-800 pt-3">
                  <div className="text-xs text-ocean-100">
                    Inspected by <span className="text-ocean-50 font-medium">{w.inspection.inspectorName}</span> · {new Date(w.inspection.inspectedAt).toLocaleString()}
                  </div>
                  {w.inspection.remarks && <div className="mt-1.5">{w.inspection.remarks}</div>}
                </div>
              )}
              {tab === 'queue' && (
                <div className="mt-4 flex justify-end gap-2">
                  <InspectButton work={w} result="failed" onDone={refresh} />
                  <InspectButton work={w} result="passed" onDone={refresh} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InspectButton({ work, result, onDone }) {
  const { open, openModal, closeModal } = useModal();
  const [remarks, setRemarks] = useState('');
  const isPass = result === 'passed';

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/works/${work._id}/inspect`, { result, remarks });
      toast.success(`Inspection ${result}`);
      closeModal();
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <button onClick={openModal} className={isPass ? 'btn-primary text-xs' : 'btn-danger text-xs'}>
        {isPass ? 'Mark passed' : 'Mark failed'}
      </button>
      <Modal open={open} onClose={closeModal} title={isPass ? 'Certify pass' : 'Mark as failed'}>
        <div className="text-sm text-ocean-100">{work.component} · <span className="font-mono">{work.partNumber}</span></div>
        <form className="space-y-3 mt-3" onSubmit={submit}>
          <div>
            <label className="label">Inspector remarks</label>
            <textarea className="input mt-1.5" rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Tolerances, deviations, follow-up notes…" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" className={isPass ? 'btn-primary' : 'btn-danger'}>{isPass ? 'Confirm pass' : 'Confirm fail'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
