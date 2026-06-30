import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Send, ChevronRight, Workflow } from 'lucide-react';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader } from '../components/AppShell.jsx';
import { Modal, useModal } from '../components/Modal.jsx';
import { PROCESSES, StatusPill } from '../data/processes.jsx';

export default function Production() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const canCreate = user.role === 'employee' || user.role === 'admin';

  const refresh = () => api.get('/works').then((r) => setWorks(r.data));
  useEffect(() => { refresh(); }, []);

  const submit = async (id) => {
    await api.post(`/works/${id}/submit`);
    toast.success('Submitted for inspection');
    refresh();
  };

  return (
    <div className="p-8 max-w-7xl space-y-8">
      <PageHeader
        title="Production"
        subtitle={user.role === 'employee' ? 'Log work against a defined process and submit completed runs for inspection.' : 'All active production runs across the floor.'}
        actions={canCreate && <NewWorkButton onCreated={refresh} />}
      />

      {works.length === 0 ? (
        <div className="panel p-12 text-center">
          <div className="font-display text-lg font-semibold">No production runs yet</div>
          <p className="text-sm text-ocean-100 mt-1">{canCreate ? 'Pick a process below and log your first entry.' : "Employees haven't logged any runs."}</p>
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ocean-950/60 text-xs uppercase tracking-wider text-ocean-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Component / Task</th>
                <th className="text-left px-4 py-3 font-medium">Part #</th>
                <th className="text-left px-4 py-3 font-medium">Qty</th>
                <th className="text-left px-4 py-3 font-medium">Employee</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {works.map((w) => (
                <tr key={w._id} className="border-t border-ocean-800 hover:bg-ocean-950/40">
                  <td className="px-4 py-3 font-medium">{w.component}</td>
                  <td className="px-4 py-3 font-mono text-xs">{w.partNumber}</td>
                  <td className="px-4 py-3 font-mono">{w.quantity}</td>
                  <td className="px-4 py-3 text-ocean-100">{w.employeeName}</td>
                  <td className="px-4 py-3"><StatusPill status={w.status} /></td>
                  <td className="px-4 py-3 text-xs text-ocean-100">{new Date(w.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {String(w.employeeId) === String(user._id) && w.status === 'in_progress' && (
                      <button className="btn-outline text-xs" onClick={() => submit(w._id)}>
                        <Send className="size-3.5" /> Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProcessCatalog />
    </div>
  );
}

function ProcessCatalog() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Workflow className="size-5 text-ocean-300" />
        <h2 className="font-display text-lg font-semibold">Manufacturing processes</h2>
        <span className="text-xs text-ocean-100">— reference catalog of all assembly workflows and stages</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {PROCESSES.map((p) => (
          <div key={p.id} className="panel p-5">
            <div className="font-display text-base font-semibold">{p.name}</div>
            <p className="text-xs text-ocean-100 mt-1">{p.description}</p>
            <div className="mt-4 space-y-3">
              {p.stages.map((s) => (
                <div key={s.name}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ocean-300">{s.name}</div>
                  <ul className="mt-1 space-y-0.5">
                    {s.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-1.5 text-sm text-ocean-100">
                        <ChevronRight className="size-3.5 mt-0.5 shrink-0 text-ocean-800" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewWorkButton({ onCreated }) {
  const { open, openModal, closeModal } = useModal();
  const [processId, setProcessId] = useState(PROCESSES[0].id);
  const process = PROCESSES.find((p) => p.id === processId);
  const [stageName, setStageName] = useState(process.stages[0].name);
  const stage = process.stages.find((s) => s.name === stageName) || process.stages[0];
  const [taskName, setTaskName] = useState(stage.tasks[0]);
  const [form, setForm] = useState({ partNumber: '', quantity: 1, notes: '' });

  const onProcessChange = (v) => {
    const p = PROCESSES.find((x) => x.id === v);
    setProcessId(v);
    setStageName(p.stages[0].name);
    setTaskName(p.stages[0].tasks[0]);
  };
  const onStageChange = (v) => {
    setStageName(v);
    const s = process.stages.find((x) => x.name === v);
    setTaskName(s.tasks[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/works', {
        component: `${process.name} › ${stage.name} › ${taskName}`,
        partNumber: form.partNumber,
        quantity: Number(form.quantity),
        notes: form.notes,
      });
      toast.success('Work entry created');
      setForm({ partNumber: '', quantity: 1, notes: '' });
      closeModal();
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <button className="btn-primary" onClick={openModal}><Plus className="size-4" /> Log work</button>
      <Modal open={open} onClose={closeModal} title="New production entry">
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="label">Process</label>
            <select className="input mt-1.5" value={processId} onChange={(e) => onProcessChange(e.target.value)}>
              {PROCESSES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Stage</label>
              <select className="input mt-1.5" value={stageName} onChange={(e) => onStageChange(e.target.value)}>
                {process.stages.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Task</label>
              <select className="input mt-1.5" value={taskName} onChange={(e) => setTaskName(e.target.value)}>
                {stage.tasks.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Part number</label>
              <input className="input mt-1.5" required value={form.partNumber} onChange={(e) => setForm({ ...form, partNumber: e.target.value })} placeholder="WR-A320-014" />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input className="input mt-1.5" required type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input mt-1.5" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Process notes, tooling, station…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary">Create entry</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
