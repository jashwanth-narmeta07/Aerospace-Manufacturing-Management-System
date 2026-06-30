import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@aerotrack.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav('/dashboard'); }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ocean-950">
      <div className="hidden lg:flex relative bg-ocean-900 border-r border-ocean-800 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 rounded-md bg-ocean-300 text-ocean-950 grid place-items-center">
            <Plane className="size-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-lg">AeroTrack</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ocean-100">Aerospace Manufacturing Suite</div>
          </div>
        </Link>
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-ocean-300/80 mb-3">// Mission Control</div>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Engineered for the<br />
            <span className="text-ocean-300">production floor.</span>
          </h2>
          <p className="mt-4 text-ocean-100 max-w-md">
            Run inventory, work orders, and inspections in one auditable workspace — from raw alloy to certified assembly.
          </p>
        </div>
        <div className="text-xs text-ocean-100 font-mono">AT-MFG / v1.0 / ISO-9100 ready</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-ocean-100 mt-1">Access your manufacturing workspace.</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            <div>
              <label className="label">Work email</label>
              <input className="input mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input mt-1.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              <Lock className="size-4" /> {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 panel p-4 text-xs">
            <div className="font-medium mb-2">Demo credentials</div>
            <div className="font-mono text-ocean-100 space-y-1">
              <div>admin@aerotrack.com / admin123</div>
              <div className="text-ocean-100/60">Admin creates manager & employee accounts from Personnel.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
