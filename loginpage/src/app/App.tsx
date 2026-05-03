import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import atLogo from '../imports/image-3.png';
import bgArt from '../imports/image-2.png';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* ── Full-screen background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002a6e] via-[#0057B8] to-[#00396e]" />

      {/* Ambient orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-400/20 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#FF7900]/15 blur-[160px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[130px] pointer-events-none" />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Glassmorphism Card ── */}
      <div
        className="relative z-10 w-full mx-4 overflow-hidden flex flex-col lg:flex-row"
        style={{
          maxWidth: '860px',
          borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >

        {/* ─── LEFT: Login form ─── */}
        <div
          className="flex-1 flex flex-col justify-center p-8 sm:p-12"
          style={{ background: 'rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Greeting */}
          <div className="mb-8">
            <h1
              className="text-white mb-1"
              style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}
            >
              Welcome back!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
              Sign in to your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500 }}
              >
                Email address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-[13px] rounded-[14px] outline-none transition-all duration-200 text-white text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.13)';
                    e.target.style.border = '1px solid rgba(0,200,255,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,200,255,0.12)';
                    const icon = e.target.previousElementSibling as HTMLElement;
                    if (icon) icon.style.color = 'rgba(0,210,255,0.8)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                    e.target.style.border = '1px solid rgba(255,255,255,0.14)';
                    e.target.style.boxShadow = 'none';
                    const icon = e.target.previousElementSibling as HTMLElement;
                    if (icon) icon.style.color = 'rgba(255,255,255,0.35)';
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500 }}
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-[13px] rounded-[14px] outline-none transition-all duration-200 text-white text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.13)';
                    e.target.style.border = '1px solid rgba(0,200,255,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,200,255,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                    e.target.style.border = '1px solid rgba(255,255,255,0.14)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  {showPassword
                    ? <EyeOff className="w-[17px] h-[17px]" />
                    : <Eye className="w-[17px] h-[17px]" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a
                href="#"
                className="transition-colors duration-200"
                style={{ color: 'rgba(0,210,255,0.75)', fontSize: '13px' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,210,255,1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,210,255,0.75)'; }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] text-white transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #0057B8 0%, #0099CC 100%)',
                boxShadow: '0 4px 20px rgba(0,87,184,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,153,204,0.55), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,87,184,0.45), inset 0 1px 0 rgba(255,255,255,0.15)';
              }}
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>
        </div>

        {/* ─── RIGHT: Info / Branding ─── */}
        <div
          className="lg:w-[340px] relative flex flex-col justify-between overflow-hidden p-8 sm:p-10"
          style={{ background: 'rgba(0,30,80,0.55)' }}
        >
          {/* Background art overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bgArt})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.12,
              mixBlendMode: 'luminosity',
            }}
          />
          {/* Gradient overlay to blend art with background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(0,57,110,0.7) 0%, rgba(0,20,60,0.9) 100%)' }}
          />

          {/* Glow accent */}
          <div
            className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full pointer-events-none"
            style={{ background: 'rgba(0,180,255,0.15)', filter: 'blur(70px)' }}
          />
          <div
            className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
            style={{ background: 'rgba(255,121,0,0.1)', filter: 'blur(60px)' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">

            {/* Logo + App name */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src={atLogo}
                alt="Algérie Télécom Logo"
                className="w-11 h-11 object-contain"
                style={{
                  borderRadius: '50%',
                  background: 'white',
                  padding: '6px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.2px' }}>
                  AI-RAG Desk
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 500 }}>
                  Infrastructure Platform
                </div>
              </div>
            </div>

            {/* Decorative line */}
            <div
              className="mb-6 w-10 h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #00C8FF, transparent)' }}
            />

            {/* Platform description */}
            <p
              className="leading-relaxed mb-auto"
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.75 }}
            >
              Plateforme intelligente de gestion des tickets d'infrastructure. Alimentée par un moteur{' '}
              <span style={{ color: 'rgba(0,210,255,0.9)', fontWeight: 600 }}>IA RAG</span>{' '}
              pour une résolution rapide et autonome.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-6 mb-8">
              {['IA générative', 'Tickets auto', 'Temps réel'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '4px 12px',
                    letterSpacing: '0.1px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Powered by */}
            <div
              className="flex items-center gap-2.5 rounded-[14px] px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ background: '#FF7900', boxShadow: '0 0 6px #FF7900' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Powered by
              </span>
              <span style={{ color: '#FF7900', fontWeight: 800, fontSize: '13px', letterSpacing: '-0.1px' }}>
                Algérie Télécom
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
