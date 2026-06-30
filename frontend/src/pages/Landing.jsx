import { Link } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-ocean-950 text-ocean-50 overflow-x-hidden">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-ocean-950/70 border-b border-ocean-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-md bg-gradient-to-br from-ocean-500 to-ocean-300 grid place-items-center shadow-lg shadow-ocean-300/20">
              <Plane className="size-4 text-ocean-950" />
            </div>
            <div className="font-display text-lg font-bold tracking-tight">
              AERO<span className="text-ocean-300">TRACK</span>
            </div>
          </div>
          <Link to="/login" className="btn-primary text-sm">
            Login <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="relative border-b border-ocean-800/60 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a4a6e_0%,#0c2340_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'linear-gradient(#5cbdb9 1px, transparent 1px), linear-gradient(90deg, #5cbdb9 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-ocean-300/60 bg-ocean-300/15 text-base sm:text-lg font-semibold tracking-wide text-ocean-300 mb-8 shadow-lg shadow-ocean-300/10">
            <span className="size-2 rounded-full bg-ocean-300 animate-pulse" />
            Aerospace Manufacturing Management System
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] max-w-5xl mx-auto">
            Build, inspect and certify the
            <span className="block bg-gradient-to-r from-ocean-300 via-ocean-500 to-ocean-300 bg-clip-text text-transparent">
              next generation of flight.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-ocean-100 leading-relaxed">
            AEROTRACK is the operations backbone for aerospace manufacturers — production runs,
            quality inspections, inventory and certified reporting, unified on one floor.
          </p>
        </div>
      </section>

      <section className="border-b border-ocean-800/60 bg-gradient-to-br from-ocean-800 to-ocean-950">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-24 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Ready to bring your floor online?</h2>
          <p className="mt-5 text-ocean-100 max-w-xl mx-auto">
            Sign in with your operator, inspector or admin credentials to enter the AEROTRACK command console.
          </p>
          <div className="mt-9">
            <Link to="/login" className="btn-primary text-base px-6 py-3">
              Login to AEROTRACK <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-ocean-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ocean-100 font-mono">
          <div>AEROTRACK · AEROSPACE MANUFACTURING MANAGEMENT SYSTEM</div>
          <div>© {new Date().getFullYear()} · All systems nominal</div>
        </div>
      </footer>
    </div>
  );
}
