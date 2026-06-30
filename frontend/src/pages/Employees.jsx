import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, ShieldCheck } from 'lucide-react';
import api from '../lib/api.js';
import { PageHeader } from '../components/AppShell.jsx';
import { Modal, useModal } from '../components/Modal.jsx';

export default function Employees() {
  const [users, setUsers] = useState([]);
  const refresh = () => api.get('/users').then((r) => setUsers(r.data));
  useEffect(() => { refresh(); }, []);

  const remove = async (u) => {
    if (!confirm(`Remove ${u.name}?`)) return;
    await api.delete(`/users/${u._id}`);
    toast.success('User removed');
    refresh();
  };

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader
        title="Personnel"
        subtitle="Create manager and employee accounts. Manage the workforce."
        actions={<NewUserButton onCreated={refresh} />}
      />

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ocean-950/60 text-xs uppercase tracking-wider text-ocean-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-ocean-800 hover:bg-ocean-950/40">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="pill bg-ocean-300/10 text-ocean-300">{u.role}</span>
                </td>
                <td className="px-4 py-3 text-ocean-100">{u.department || '—'}</td>
                <td className="px-4 py-3 text-xs text-ocean-100">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <EditUserButton user={u} onSaved={refresh} />
                    {u.role !== 'admin' && (
                      <button className="btn-ghost p-2" onClick={() => remove(u)}><Trash2 className="size-4 text-red-400" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 panel p-5 flex items-start gap-3">
        <ShieldCheck className="size-5 text-ocean-300 mt-0.5" />
        <div className="text-sm">
          <div className="font-medium">Role responsibilities</div>
          <ul className="mt-1 text-ocean-100 space-y-0.5">
            <li>• <span className="text-ocean-50 font-medium">Admin</span>: create accounts, manage inventory and roles.</li>
            <li>• <span className="text-ocean-50 font-medium">Manager</span>: inspect submitted work and publish reports.</li>
            <li>• <span className="text-ocean-50 font-medium">Employee</span>: log production work and submit for inspection.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function NewUserButton({ onCreated }) {
  const { open, openModal, closeModal } = useModal();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      toast.success(`${form.role === 'manager' ? 'Manager' : 'Employee'} created`);
      setForm({ name: '', email: '', password: '', role: 'employee', department: '' });
      closeModal();
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <button className="btn-primary" onClick={openModal}><Plus className="size-4" /> Add personnel</button>
      <Modal open={open} onClose={closeModal} title="Create account">
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="label">Full name</label>
            <input className="input mt-1.5" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email</label>
              <input className="input mt-1.5" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Temporary password</label>
              <input className="input mt-1.5" required minLength={4} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input mt-1.5" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input mt-1.5" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Assembly · QA · Avionics" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary">Create account</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function EditUserButton({ user, onSaved }) {
  const { open, openModal, closeModal } = useModal();
  const [form, setForm] = useState({ name: user.name, email: user.email, password: '', role: user.role, department: user.department || '' });

  const onOpen = () => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role, department: user.department || '' });
    openModal();
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await api.put(`/users/${user._id}`, payload);
      toast.success('Account updated');
      closeModal();
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <button className="btn-ghost p-2" onClick={onOpen}><Pencil className="size-4" /></button>
      <Modal open={open} onClose={closeModal} title={`Edit ${user.name}`}>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="label">Full name</label>
            <input className="input mt-1.5" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email</label>
              <input className="input mt-1.5" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">New password (optional)</label>
              <input className="input mt-1.5" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input mt-1.5" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={user.role === 'admin'}>
                {user.role === 'admin' && <option value="admin">Admin</option>}
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input mt-1.5" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
