import { useState } from 'react';
import { useLogin } from '../hooks/auth/useLogin';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';
import backgroundImg from '../assets/background.png';

const AT_GREEN = '#7DC242';

export default function LoginPage() {
  const { mutate: login, isPending: loading } = useLogin();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* ── Geometric background — tiled at natural resolution ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: '1094px 513px',
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Dark overlay so the card stays readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ── Glassmorphism card ── */}
      <div
        className="relative z-10 w-full mx-4 overflow-hidden flex flex-col lg:flex-row"
        style={{
          maxWidth: '860px',
          borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
      >

        {/* ─── LEFT: login form ─── */}
        <div
          className="flex-1 flex flex-col justify-center p-8 sm:p-12"
          style={{ background: 'rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="mb-8">
            <h1 className="text-white mb-1" style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Bienvenue !
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
              Accédez à votre espace de gestion des tickets
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500 }}>
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px]" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-[13px] rounded-[14px] outline-none transition-all duration-200 text-white text-sm placeholder:text-white/30"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', fontSize: '14px' }}
                  onFocus={(e) => {
                    e.target.style.background  = 'rgba(255,255,255,0.13)';
                    e.target.style.border      = '1px solid rgba(0,200,255,0.5)';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(0,200,255,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background  = 'rgba(255,255,255,0.08)';
                    e.target.style.border      = '1px solid rgba(255,255,255,0.14)';
                    e.target.style.boxShadow   = 'none';
                  }}
                  placeholder="email@at.dz"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500 }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px]" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-[13px] rounded-[14px] outline-none transition-all duration-200 text-white text-sm placeholder:text-white/30"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', fontSize: '14px' }}
                  onFocus={(e) => {
                    e.target.style.background  = 'rgba(255,255,255,0.13)';
                    e.target.style.border      = '1px solid rgba(0,200,255,0.5)';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(0,200,255,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background  = 'rgba(255,255,255,0.08)';
                    e.target.style.border      = '1px solid rgba(255,255,255,0.14)';
                    e.target.style.boxShadow   = 'none';
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  {showPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] text-white transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: 'linear-gradient(135deg, #0057B8 0%, #0099CC 100%)',
                boxShadow: '0 4px 20px rgba(0,87,184,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,153,204,0.55), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,87,184,0.45), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
            >
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />}
            </button>
          </form>
        </div>

        {/* ─── RIGHT: branding ─── */}
        <div
          className="lg:w-[340px] relative flex flex-col justify-between overflow-hidden p-8 sm:p-10"
          style={{ background: 'rgba(0,20,60,0.60)' }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(0,57,110,0.55) 0%, rgba(0,10,40,0.85) 100%)' }}
          />
          {/* Glow accents */}
          <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full pointer-events-none" style={{ background: 'rgba(0,180,255,0.12)', filter: 'blur(70px)' }} />
          <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none" style={{ background: 'rgba(125,194,66,0.1)', filter: 'blur(60px)' }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center h-full text-center">

            {/* App name + logo side by side */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImg}
                alt="Intelligent Hosting Ticket"
                className="w-14 h-14 object-contain drop-shadow-2xl flex-shrink-0"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,120,255,0.5))' }}
              />
              <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.2px', lineHeight: 1.4, textAlign: 'left' }}>
                Intelligent Hosting<br />Ticket Plateforme
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 500, marginBottom: '20px' }}>
              Infrastructure Platform
            </div>

            {/* Decorative line */}
            <div className="w-10 h-[3px] rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #00C8FF, transparent)' }} />

            {/* Description */}
            <p className="leading-relaxed mb-auto" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.75 }}>
              Plateforme intelligente de gestion des tickets d'infrastructure, alimentée par l'IA pour une résolution rapide et autonome.
            </p>

            {/* Powered by */}
            <div
              className="flex items-center gap-2.5 rounded-[14px] px-4 py-3 mt-8"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: AT_GREEN, boxShadow: `0 0 6px ${AT_GREEN}` }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Powered by
              </span>
              <span style={{ color: AT_GREEN, fontWeight: 800, fontSize: '13px', letterSpacing: '-0.1px' }}>
                Algérie Télécom
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
