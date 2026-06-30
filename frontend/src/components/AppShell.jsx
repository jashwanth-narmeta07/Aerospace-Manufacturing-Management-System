import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Plane, LayoutDashboard, Factory, ClipboardCheck, Package, Users, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin','manager','employee'] },
  { to: '/production', label: 'Production', icon: Factory, roles: ['admin','manager','employee'] },
  { to: '/inspections', label: 'Inspections', icon: ClipboardCheck, roles: ['admin','manager'] },
  { to: '/inventory', label: 'Inventory', icon: Package, roles: ['admin','manager','employee'] },
  { to: '/employees', label: 'Personnel', icon: Users, roles: ['admin'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin','manager'] },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const items = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-ocean-900 border-r border-ocean-800 flex flex-col">
        <div className="px-5 py-5 border-b border-ocean-800">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="size-9 rounded-md bg-ocean-300 text-ocean-950 grid place-items-center">
              <Plane className="size-5" />
            </div>
            <div>
              <div className="font-display font-semibold tracking-tight">AeroTrack</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ocean-100">Mfg. Mgmt</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-ocean-300 text-ocean-950' : 'text-ocean-50/80 hover:bg-ocean-800/60'
                  }`
                }
              >
                <Icon className="size-4" />
                {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-ocean-800 p-3">
          <div className="px-2 py-2">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-ocean-100 capitalize flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" /> {user.role}
            </div>
          </div>
          <button
            onClick={() => { logout(); nav('/login'); }}
            className="btn-ghost w-full justify-start"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ocean-100 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}