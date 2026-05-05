import { useState } from 'react';
import {
  Sparkles, FilePlus2, Bot, Zap, UserCheck,
  MessageCircle, Bell, Rocket, ChevronRight,
  ChevronLeft, CheckCircle2, Tag, AlignLeft,
  X, ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

// ── Step definitions ────────────────────────────────────────────────────────
const buildSteps = (name) => [
  {
    id: 'welcome',
    label: 'Bienvenue',
    panelIcon: Sparkles,
    panelBg: 'from-[#002D72] to-[#003f9e]',
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6 shadow-lg">
          <Sparkles size={36} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3 leading-tight">
          Bienvenue,&nbsp;
          <span className="text-primary">{name || '…'}</span>&nbsp;!
        </h1>
        <p className="text-text-muted text-base max-w-md leading-relaxed">
          Vous venez de rejoindre la plateforme de gestion de tickets d'<strong className="text-text-secondary">Algérie Télécom</strong>.
        </p>
        <p className="text-text-muted text-sm mt-4 max-w-sm leading-relaxed">
          En 5 étapes rapides, nous allons vous expliquer comment fonctionne notre système et comment tirer le meilleur parti de l'intelligence artificielle intégrée.
        </p>
        <div className="mt-8 flex items-center gap-6">
          {[
            { icon: FilePlus2, label: 'Créer' },
            { icon: Bot, label: 'IA analyse' },
            { icon: Rocket, label: 'Résolution' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <span className="text-[11px] text-text-muted font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'create',
    label: 'Créer un ticket',
    panelIcon: FilePlus2,
    panelBg: 'from-[#002D72] to-[#004aad]',
    content: (
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-card bg-primary-light flex items-center justify-center mb-5">
          <FilePlus2 size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Soumettez votre demande</h2>
        <p className="text-sm text-text-muted mb-7 leading-relaxed">
          Créer un ticket est simple et rapide. Voici les trois informations que nous vous demanderons :
        </p>
        <div className="space-y-4">
          {[
            {
              step: '1',
              icon: AlignLeft,
              title: 'Titre',
              desc: 'Un résumé concis du problème rencontré.',
              color: 'text-primary bg-primary-light',
            },
            {
              step: '2',
              icon: Tag,
              title: 'Catégorie',
              desc: 'Réseau, Sécurité, Déploiement… choisissez celle qui correspond.',
              color: 'text-amber-600 bg-amber-50',
            },
            {
              step: '3',
              icon: AlignLeft,
              title: 'Description détaillée',
              desc: "Plus vous détaillez, plus l'IA sera précise et rapide.",
              color: 'text-green-600 bg-green-50',
            },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="flex items-start gap-4 bg-surface-muted rounded-card p-4 border border-border">
              <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', color)}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{title}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <span className="ml-auto text-xs font-mono text-text-muted font-bold">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-5 flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
          Vous pouvez aussi joindre des fichiers (logs, captures d'écran) après création.
        </p>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'Analyse IA',
    panelIcon: Bot,
    panelBg: 'from-[#002D72] to-[#005580]',
    content: (
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-card bg-blue-50 flex items-center justify-center mb-5">
          <Bot size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">L'IA analyse votre ticket</h2>
        <p className="text-sm text-text-muted mb-7 leading-relaxed">
          Dès que vous soumettez, notre moteur d'intelligence artificielle prend le relais automatiquement.
        </p>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-divider" />
          <div className="space-y-5">
            {[
              {
                icon: Tag,
                color: 'bg-primary text-white',
                title: 'Détection de catégorie',
                desc: "L'IA confirme ou corrige la catégorie choisie selon la description.",
              },
              {
                icon: AlignLeft,
                color: 'bg-amber-500 text-white',
                title: 'Score de richesse',
                desc: 'Évalue la qualité et la précision de votre description.',
              },
              {
                icon: Bot,
                color: 'bg-green-600 text-white',
                title: 'Recherche de solutions similaires',
                desc: 'Compare avec les tickets passés dans la base de connaissances.',
              },
              {
                icon: Zap,
                color: 'bg-purple-600 text-white',
                title: 'Décision automatique',
                desc: "L'IA décide du meilleur parcours pour votre ticket.",
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm', color)}>
                  <Icon size={15} />
                </div>
                <div className="bg-white border border-border rounded-btn px-4 py-3 flex-1">
                  <p className="text-sm font-semibold text-text-primary">{title}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'scenarios',
    label: 'Scénarios',
    panelIcon: Zap,
    panelBg: 'from-[#002D72] to-[#1a3a6e]',
    content: (
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-card bg-purple-50 flex items-center justify-center mb-5">
          <Zap size={24} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Trois parcours possibles</h2>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">
          Selon le résultat de l'analyse, votre ticket empruntera l'un de ces trois chemins :
        </p>
        <div className="space-y-4">
          <div className="border-l-4 border-l-green-500 bg-green-50 rounded-r-card p-4">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Zap size={15} className="text-green-600" />
              </div>
              <p className="text-sm font-bold text-green-800">Résolution automatique</p>
            </div>
            <p className="text-xs text-green-700 leading-relaxed pl-11">
              L'IA trouve une solution dans la base de connaissances et vous l'envoie immédiatement. Aucune attente !
            </p>
          </div>
          <div className="border-l-4 border-l-primary bg-primary-light rounded-r-card p-4">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCheck size={15} className="text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">Assignation à un ingénieur</p>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed pl-11">
              L'IA ne peut pas résoudre seule — un ingénieur spécialisé est assigné à votre ticket et vous apportera une solution.
            </p>
          </div>
          <div className="border-l-4 border-l-amber-500 bg-amber-50 rounded-r-card p-4">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <MessageCircle size={15} className="text-amber-600" />
              </div>
              <p className="text-sm font-bold text-amber-800">Demande de clarification</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed pl-11">
              L'ingénieur ou le bot a besoin de plus d'informations. Vous recevrez une notification et pourrez répondre directement sur la plateforme.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'notifications',
    label: 'Suivi',
    panelIcon: Bell,
    panelBg: 'from-[#002D72] to-[#00416a]',
    content: (
      <div className="w-full max-w-md">
        <div className="w-12 h-12 rounded-card bg-amber-50 flex items-center justify-center mb-5">
          <Bell size={24} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Restez informé à chaque étape</h2>
        <p className="text-sm text-text-muted mb-7 leading-relaxed">
          Vous ne manquerez aucune mise à jour grâce à notre système de notifications en temps réel.
        </p>
        <div className="space-y-3">
          {[
            { color: 'bg-green-500', text: "Votre ticket #142 a été résolu automatiquement par l'IA." },
            { color: 'bg-primary', text: "L'ingénieur Ahmed a pris en charge votre ticket #138." },
            { color: 'bg-amber-500', text: "L'ingénieur vous demande des précisions sur le ticket #135." },
          ].map(({ color, text }, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white border border-border rounded-card px-4 py-3 shadow-sm"
              style={{ animation: `slideUp 0.3s ease-out ${i * 0.1}s both` }}
            >
              <span className={clsx('mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0', color)} />
              <p className="text-sm text-text-secondary leading-snug">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: Bell, label: 'Cloche en haut à droite' },
            { icon: FilePlus2, label: 'Tous vos tickets' },
            { icon: CheckCircle2, label: 'Historique complet' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-surface-muted rounded-btn p-3 border border-border">
              <Icon size={16} className="text-primary mx-auto mb-1.5" />
              <p className="text-[10px] text-text-muted leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'ready',
    label: 'Prêt !',
    panelIcon: Rocket,
    panelBg: 'from-[#002D72] to-[#003a7a]',
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center shadow-lg">
            <Rocket size={44} className="text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow">
            <CheckCircle2 size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-3">Vous êtes prêt !</h2>
        <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
          Vous connaissez maintenant les bases. Votre tableau de bord vous attend — soumettez votre premier ticket et laissez l'IA faire le reste.
        </p>
        <div className="w-full max-w-xs bg-surface-muted rounded-card border border-border p-4 text-left space-y-2 mb-2">
          {[
            'Soumettez un ticket en 1 minute',
            "L'IA analyse et oriente automatiquement",
            "Suivez l'avancement en temps réel",
          ].map((item) => (
            <p key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              {item}
            </p>
          ))}
        </div>
      </div>
    ),
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function OnboardingFlow({ name, onComplete }) {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const steps = buildSteps(name);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  const goTo = (next) => {
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  const PanelIcon = current.panelIcon;

  return (
    <div className="fixed inset-0 z-[9999] flex overflow-hidden">

      {/* ── Left brand panel ───────────────────────────── */}
      <div
        className={clsx(
          'hidden md:flex flex-col justify-between w-[280px] lg:w-[340px] flex-shrink-0 px-8 py-10 bg-gradient-to-b',
          current.panelBg,
        )}
        style={{ transition: 'background 0.6s ease' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/at-logo.svg" alt="AT" className="w-9 h-9 flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-[14px] leading-tight">Algérie Télécom</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Hosting Ticket System</p>
          </div>
        </div>

        {/* Center illustration */}
        <div className="flex flex-col items-center gap-5 py-10">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <PanelIcon size={38} className="text-white/90" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg leading-tight">{current.label}</p>
            <p className="text-white/50 text-xs mt-1">Étape {step + 1} sur {steps.length}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={clsx(
                'rounded-full transition-all duration-300',
                i === step
                  ? 'w-6 h-2 bg-white'
                  : i < step
                    ? 'w-2 h-2 bg-white/60'
                    : 'w-2 h-2 bg-white/25',
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Right content panel ────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-[#002D72] to-[#003f9e]">
          <div className="flex items-center gap-2">
            <img src="/at-logo.svg" alt="AT" className="w-7 h-7" />
            <span className="text-white font-semibold text-sm">Algérie Télécom</span>
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  'rounded-full transition-all duration-300',
                  i === step ? 'w-5 h-2 bg-white' : i < step ? 'w-2 h-2 bg-white/60' : 'w-2 h-2 bg-white/25',
                )}
              />
            ))}
          </div>
        </div>

        {/* Skip button */}
        {!isLast && (
          <div className="flex justify-end px-8 pt-6">
            <button
              onClick={onComplete}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <X size={13} /> Passer le tutoriel
            </button>
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div
            key={animKey}
            className="w-full max-w-lg animate-fade-in"
            style={{ animation: 'onboardSlide 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {current.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-10 flex items-center justify-between">
          <button
            onClick={() => goTo(step - 1)}
            disabled={isFirst}
            className={clsx(
              'flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2.5 rounded-btn',
              isFirst
                ? 'opacity-0 pointer-events-none'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted',
            )}
          >
            <ChevronLeft size={16} /> Précédent
          </button>

          {isLast ? (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-2.5 rounded-btn bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Accéder au tableau de bord
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => goTo(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-btn bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes onboardSlide {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
