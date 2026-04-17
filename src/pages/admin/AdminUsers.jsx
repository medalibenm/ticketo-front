import { useState } from 'react';
import { adminUsersService } from '../../services/api';
import { usePaginated } from '../../hooks/useAsync';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Toggle } from '../../components/ui/Input';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Pencil, Trash2 } from 'lucide-react';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EMPTY_ENGINEER = { name: '', email: '', password: '', specialty: '', level: 'JUNIOR', available: true };
const EMPTY_DEVELOPER = { name: '', email: '', password: '', company: '' };
const EMPTY_ADMIN = { name: '', email: '', password: '' };

export default function AdminUsers() {
  const toast = useToast();
  const { items, total, loading, page, totalPages, limit, goToPage, refetch } = usePaginated(
    adminUsersService.getUsers.bind(adminUsersService)
  );

  // Modals state
  const [modal, setModal] = useState(null); // 'engineer' | 'developer' | 'admin' | 'edit-eng' | 'edit-dev'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = (type) => {
    setModal(type);
    setEditTarget(null);
    setForm(type === 'engineer' ? { ...EMPTY_ENGINEER } : type === 'developer' ? { ...EMPTY_DEVELOPER } : { ...EMPTY_ADMIN });
  };

  const openEdit = (user) => {
    const type = user.role === 'ENGINEER' ? 'edit-eng' : 'edit-dev';
    setModal(type);
    setEditTarget(user);
    setForm({
      name: user.name, email: user.email, password: '',
      specialty: user.specialty || '',
      level: user.level || 'JUNIOR',
      available: user.available ?? true,
      company: user.company || '',
    });
  };

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target ? e.target.value : e }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (modal === 'engineer') await adminUsersService.createEngineer(form);
      else if (modal === 'developer') await adminUsersService.createDeveloper(form);
      else if (modal === 'admin') await adminUsersService.createAdmin(form);
      else if (modal === 'edit-eng') await adminUsersService.updateEngineer(editTarget.id, form);
      else if (modal === 'edit-dev') await adminUsersService.updateDeveloper(editTarget.id, form);

      toast.success('Opération effectuée avec succès.');
      setModal(null);
      refetch();
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminUsersService.deleteUser(deleteTarget.id);
      toast.success(`Utilisateur "${deleteTarget.name}" supprimé.`);
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error('Impossible de supprimer cet utilisateur.');
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = {
    engineer: 'Ajouter un ingénieur',
    developer: 'Ajouter un développeur',
    admin: 'Ajouter un administrateur',
    'edit-eng': 'Modifier l\'ingénieur',
    'edit-dev': 'Modifier le développeur',
  };

  return (
    <div className="space-y-5">
      {/* Top actions */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={() => openCreate('developer')}>+ Ajouter un développeur</Button>
        <Button variant="secondary" size="sm" onClick={() => openCreate('admin')}>+ Ajouter un admin</Button>
        <Button variant="primary" size="sm" onClick={() => openCreate('engineer')}>+ Ajouter un ingénieur</Button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={9} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                {['#', 'Nom', 'Email', 'Rôle', 'Entreprise / Spécialité', 'Niveau', 'Disponibilité', 'Créé le', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-t border-divider hover:bg-surface-muted h-[52px] transition-colors">
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-sm text-text-primary whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{user.company || user.specialty || '—'}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{user.level || '—'}</td>
                  <td className="px-4 py-3">
                    {user.available !== null
                      ? <span className={`text-xs font-medium ${user.available ? 'text-success' : 'text-danger'}`}>
                          {user.available ? 'Disponible' : 'Indisponible'}
                        </span>
                      : <span className="text-text-muted text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {(user.role === 'ENGINEER' || user.role === 'DEVELOPER') && (
                        <button
                          onClick={() => openEdit(user)}
                          className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-danger hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={goToPage} loading={loading} />
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modalTitle[modal] || ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {modal?.startsWith('edit') ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Admin warning */}
          {modal === 'admin' && (
            <div className="flex items-start gap-2 bg-accent-light border border-yellow-200 rounded-btn px-4 py-3">
              <span className="text-base">⚠️</span>
              <p className="text-xs text-accent-text font-medium">Les administrateurs ont un accès complet à la plateforme.</p>
            </div>
          )}

          <Input label="Nom complet" value={form.name || ''} onChange={f('name')} placeholder="Prénom Nom" />
          <Input label="Adresse e-mail" type="email" value={form.email || ''} onChange={f('email')} placeholder="email@at.dz" />
          <Input label="Mot de passe" type="password" value={form.password || ''} onChange={f('password')} placeholder="••••••••" />

          {(modal === 'developer' || modal === 'edit-dev') && (
            <Input label="Entreprise (optionnel)" value={form.company || ''} onChange={f('company')} placeholder="Nom de l'entreprise" />
          )}

          {(modal === 'engineer' || modal === 'edit-eng') && (
            <>
              <Input label="Spécialité (optionnel)" value={form.specialty || ''} onChange={f('specialty')} placeholder="ex: Réseau, Sécurité…" />
              <Select label="Niveau" value={form.level || 'JUNIOR'} onChange={f('level')}>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
              </Select>
              <Toggle
                label="Disponible"
                checked={form.available ?? true}
                onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
              />
            </>
          )}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
