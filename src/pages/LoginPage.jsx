import { useState } from 'react';
import { useLogin } from '../hooks/auth/useLogin';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { mutate: login, isPending: loading } = useLogin();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Brand */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">AT</span>
              </div>
              <div>
                <p className="font-bold text-[22px] text-primary leading-tight">AT Ticket System</p>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">Connexion</h1>
            <p className="text-sm text-text-muted mt-1">
              Accédez à votre espace de gestion des tickets.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-text-secondary">Adresse e-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@at.dz"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-input-bg border border-input-border rounded-btn text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-text-secondary">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-input-bg border border-input-border rounded-btn text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-6" size="lg" loading={loading}>
              Se connecter
            </Button>
          </form>
        </div>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-1 bg-primary flex-col items-center justify-center relative overflow-hidden px-12">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-accent opacity-70" />
        <div className="absolute top-1/3 right-1/3 w-5 h-5 rounded-full bg-accent opacity-40" />

        <div className="relative z-10 text-center max-w-sm">
          {/* AT monogram */}
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8">
            <span className="text-accent-text font-bold text-3xl">AT</span>
          </div>
          <h2 className="text-white font-bold text-3xl mb-4 leading-tight">
            Algérie Télécom<br />Ticket System
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Plateforme intelligente de gestion des tickets d'infrastructure. Alimentée par un moteur IA RAG pour une résolution rapide et autonome.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '89%', label: 'Résolu par IA' },
              { value: '<4h', label: 'Temps moyen' },
              { value: '147', label: 'Tickets actifs' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-lg p-3">
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-white/60 text-[11px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
