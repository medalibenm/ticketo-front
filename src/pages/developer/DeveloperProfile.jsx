import { useState, useEffect } from 'react';
import { useDeveloperProfile } from '../../hooks/developer/useDeveloperProfile';
import { useUpdateDeveloperProfile } from '../../hooks/developer/useUpdateDeveloperProfile';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RoleBadge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { Mail, Edit3 } from 'lucide-react';

export default function DeveloperProfile() {
  const { data: profile, isLoading } = useDeveloperProfile();
  const updateProfile = useUpdateDeveloperProfile();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', password: '', confirm_password: '' });

  useEffect(() => {
    if (profile) setForm({ name: profile.name, password: '', confirm_password: '' });
  }, [profile]);

  const handleSave = async () => {
    if (form.password && form.password !== form.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: form.name,
        ...(form.password ? {
          password: form.password,
          confirm_password: form.confirm_password,
        } : {}),
      });
      toast.success('Profil mis à jour.');
      setEditing(false);
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const handleCancel = () => {
    setForm({ name: profile?.name || '', password: '', confirm_password: '' });
    setEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-64 rounded-card" />
        <div className="skeleton h-48 rounded-card" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Mon Profil</h1>
        <p className="text-sm text-text-muted mt-1">Gérez vos informations personnelles et vos paramètres d'accès.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-border rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.05s both' }}>
        {/* Header strip */}
        <div className="h-24 bg-gradient-to-r from-primary to-primary-dark relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-card flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{initials}</span>
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{profile.name}</h2>
              <p className="text-sm text-text-muted flex items-center gap-1.5 mt-0.5">
                <Mail size={13} /> {profile.email}
              </p>
            </div>
            {!editing && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <Edit3 size={13} /> Modifier
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={profile.role} />
          </div>
        </div>
      </div>

      {/* Account Settings Card */}
      <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.15s both' }}>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Informations du compte</h3>
        {!editing && (
          <p className="text-xs text-text-muted mb-5">Laissez vide pour conserver le mot de passe actuel.</p>
        )}

        {editing ? (
          <div className="space-y-4 max-w-md">
            <Input
              label="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Votre nom"
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Laisser vide pour ne pas changer"
            />
            {form.password && (
              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="Confirmer votre nouveau mot de passe"
              />
            )}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} loading={updateProfile.isPending}>Enregistrer</Button>
              <Button variant="secondary" onClick={handleCancel}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-md">
            <div>
              <p className="text-xs text-text-muted mb-0.5">Nom complet</p>
              <p className="text-sm text-text-primary font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">Email</p>
              <p className="text-sm text-text-secondary">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">Rôle</p>
              <p className="text-sm text-text-secondary">Développeur</p>
            </div>
            <div className="pt-2">
              <p className="text-[11px] text-text-muted font-mono">
                Identifiant de sécurité : AT-DEV-{String(profile.id).padStart(4, '0')}-Z
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
