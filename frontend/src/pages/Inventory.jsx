import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader } from '../components/AppShell.jsx';

export default function Inventory() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const canEdit = user.role === 'admin' || user.role === 'manager';

  useEffect(() => { api.get('/inventory').then((r) => setItems(r.data)); }, []);

  const updateQty = async (id, q) => {
    try {
      const { data } = await api.put(`/inventory/${id}`, { quantity: Number(q) });
      setItems((prev) => prev.map((i) => (i._id === id ? data : i)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader title="Inventory" subtitle="Raw materials, consumables, and stock levels." />
      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ocean-950/60 text-xs uppercase tracking-wider text-ocean-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Material</th>
              <th className="text-left px-4 py-3 font-medium">SKU</th>
              <th className="text-left px-4 py-3 font-medium">On hand</th>
              <th className="text-left px-4 py-3 font-medium">Reorder at</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const low = i.quantity <= i.reorderLevel;
              return (
                <tr key={i._id} className="border-t border-ocean-800 hover:bg-ocean-950/40">
                  <td className="px-4 py-3 font-medium">{i.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{i.sku}</td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <input className="input h-8 w-28 font-mono" type="number" defaultValue={i.quantity} onBlur={(e) => { const q = Number(e.target.value); if (q !== i.quantity) updateQty(i._id, q); }} />
                    ) : <span className="font-mono">{i.quantity} {i.unit}</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-ocean-100">{i.reorderLevel} {i.unit}</td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="pill bg-red-500/10 text-red-400"><AlertTriangle className="size-3" /> Low</span>
                    ) : (
                      <span className="pill bg-emerald-500/10 text-emerald-400">Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
