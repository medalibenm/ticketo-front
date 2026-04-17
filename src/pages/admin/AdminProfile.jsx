import { useState } from 'react';
import { adminProfileService } from '../../services/api';
import { useAsync } from '../../hooks/useAsync';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { RoleBadge } from '../../components/ui/Badge';

export default function AdminProfile() {
  const toast = useToast();
  const { data: profile, loading } = useAsync(() => adminProfileService.getProfile(), []);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', password: '' });
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setForm({ name: profile.name, password: '' });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminProfileService.updateProfile(form);
      toast.success('Profil mis à jour avec succès.');
      setEditing(false);
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonCard className="max-w-2xl" />;

  const initials = profile?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-border rounded-card shadow-card p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-xl">{initials}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">{profile.name}</h2>
                <p className="text-sm text-text-muted mt-0.5">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RoleBadge role={profile.role} />
                  {profile.is_super_admin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#FFFBEE', color: '#6B4800' }}>
                      ⭐ Super Admin
                    </span>
                  )}
                </div>
              </div>
              {!editing && (
                <Button variant="secondary" size="sm" onClick={startEdit}>Modifier</Button>
              )}
            </div>

            <div className="mt-6 border-t border-divider pt-6 space-y-4">
              {editing ? (
                <>
                  <Input
                    label="Nom complet"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Laisser vide pour ne pas changer"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[13px] font-medium text-text-secondary mb-1">Email</p>
                      <p className="text-sm text-text-muted">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text-secondary mb-1">Rôle</p>
                      <p className="text-sm text-text-muted">{profile.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="primary" onClick={handleSave} loading={saving}>Enregistrer</Button>
                    <Button variant="secondary" onClick={() => setEditing(false)}>Annuler</Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Nom', value: profile.name },
                    { label: 'Email', value: profile.email },
                    { label: 'Rôle', value: profile.role },
                    { label: 'Super Admin', value: profile.is_super_admin ? 'Oui' : 'Non' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[13px] font-medium text-text-secondary">{label}</p>
                      <p className="text-sm text-text-primary mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
