import { useEffect, useState } from 'react';
import { useAllUsers } from '../../hooks/admin/useAllUsers';
import { useCreateEngineer } from '../../hooks/admin/useCreateEngineer';
import { useCreateDeveloper } from '../../hooks/admin/useCreateDeveloper';
import { useCreateAdmin } from '../../hooks/admin/useCreateAdmin';
import { useDeleteUser } from '../../hooks/admin/useDeleteUser';
import { useUpdateEngineer } from '../../hooks/admin/useUpdateEngineer';
import { useUpdateDeveloper } from '../../hooks/admin/useUpdateDeveloper';
import { getErrorMessage } from '../../api/errors';

import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Toggle } from '../../components/ui/Input';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Pencil, Trash2 } from 'lucide-react';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EMPTY_ENGINEER = { name: '', email: '', password: '', specialite: '', niveau: 'JUNIOR', disponibilite: true };
const EMPTY_DEVELOPER = { name: '', email: '', password: '', entreprise: '' };
const EMPTY_ADMIN = { name: '', email: '', password: '' };

export default function AdminUsers() {
  const toast = useToast();

  // Pagination (zero-based for Pagination component)
  const [page, setPage] = useState(0);
  const limit = 10;
  const { data, isLoading: loading } = useAllUsers({ skip: 0, limit: 1000 });
  const allUsers = data?.items || [];
  const total = allUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const start = page * limit;
  const end = start + limit;
  const items = allUsers.slice(start, end);

  // Mutations
  const { mutateAsync: createEngineer } = useCreateEngineer();
  const { mutateAsync: createDeveloper } = useCreateDeveloper();
  const { mutateAsync: createAdmin } = useCreateAdmin();
  const { mutateAsync: updateEngineer } = useUpdateEngineer();
  const { mutateAsync: updateDeveloper } = useUpdateDeveloper();
  const { mutateAsync: deleteUser } = useDeleteUser();

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
      specialite: user.specialite || '',
      niveau: user.niveau || 'JUNIOR',
      disponibilite: user.disponibilite ?? true,
      entreprise: user.entreprise || '',
    });
  };

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target ? e.target.value : e }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (modal === 'engineer') {
        await createEngineer({
          name: form.name,
          email: form.email,
          password: form.password,
          specialite: form.specialite,
          niveau: form.niveau,
        });
        setPage(Math.max(0, Math.ceil((total + 1) / limit) - 1));
      } else if (modal === 'developer') {
        await createDeveloper({
          name: form.name,
          email: form.email,
          password: form.password,
          entreprise: form.entreprise,
        });
        setPage(Math.max(0, Math.ceil((total + 1) / limit) - 1));
      } else if (modal === 'admin') {
        await createAdmin({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setPage(Math.max(0, Math.ceil((total + 1) / limit) - 1));
      } else if (modal === 'edit-eng') {
        await updateEngineer({
          userId: editTarget.id,
          body: {
            specialite: form.specialite || null,
            niveau: form.niveau || null,
            disponibilite: Boolean(form.disponibilite),
          },
        });
      } else if (modal === 'edit-dev') {
        await updateDeveloper({
          userId: editTarget.id,
          body: {
            entreprise: form.entreprise || null,
          },
        });
      }

      toast.success('Operation completed successfully.');
      setModal(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success(`User "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      const nextTotal = Math.max(0, total - 1);
      const lastPageAfterDelete = Math.max(0, Math.ceil(nextTotal / limit) - 1);
      if (page > lastPageAfterDelete) {
        setPage(lastPageAfterDelete);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = {
    engineer: 'Add an Engineer',
    developer: 'Add a Developer',
    admin: 'Add an Admin',
    'edit-eng': 'Edit Engineer',
    'edit-dev': 'Edit Developer',
  };

  return (
    <div className="space-y-5">
      {/* Top Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={() => openCreate('developer')}>+ Add a Developer</Button>
        <Button variant="secondary" size="sm" onClick={() => openCreate('admin')}>+ Add an Admin</Button>
        <Button variant="primary" size="sm" onClick={() => openCreate('engineer')}>+ Add an Engineer</Button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={9} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  {['#', 'Name', 'Email', 'Role', 'Company / Specialty', 'Level', 'Availability', 'Created At', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
                {items.map((user) => (
                  <tr key={user.id} className="border-t border-divider hover:bg-surface-muted h-[52px] transition-colors">
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{user.id}</td>
                    <td className="px-4 py-3 font-medium text-sm text-text-primary whitespace-nowrap">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.entreprise || user.specialite || '-'}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.niveau || '-'}</td>
                    <td className="px-4 py-3">
                      {user.disponibilite !== null
                        ? <span className={`text-xs font-medium ${user.disponibilite ? 'text-success' : 'text-danger'}`}>
                            {user.disponibilite ? 'Available' : 'Unavailable'}
                          </span>
                        : <span className="text-text-muted text-xs">-</span>}
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
          </div>

          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} loading={loading} />
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
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {modal?.startsWith('edit') ? 'Save' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Admin warning */}
          {modal === 'admin' && (
            <div className="flex items-start gap-2 bg-accent-light border border-yellow-200 rounded-btn px-4 py-3">
              <span className="text-base">!</span>
              <p className="text-xs text-accent-text font-medium">Administrators have full access to the platform.</p>
            </div>
          )}

          <Input label="Full Name" value={form.name || ''} onChange={f('name')} placeholder="First Last" disabled={modal?.startsWith('edit')} />
          <Input label="Email Address" type="email" value={form.email || ''} onChange={f('email')} placeholder="email@at.dz" disabled={modal?.startsWith('edit')} />
          {!modal?.startsWith('edit') && (
            <Input label="Password" type="password" value={form.password || ''} onChange={f('password')} placeholder="********" />
          )}

          {(modal === 'developer' || modal === 'edit-dev') && (
            <Input label="Company" value={form.entreprise || ''} onChange={f('entreprise')} placeholder="Company name" />
          )}

          {(modal === 'engineer' || modal === 'edit-eng') && (
            <>
              <Input label="Specialty" value={form.specialite || ''} onChange={f('specialite')} placeholder="e.g. Network, Security" />
              <Select label="Level" value={form.niveau || 'JUNIOR'} onChange={f('niveau')}>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </Select>
              {modal === 'edit-eng' && (
                <Toggle
                  label="Available"
                  checked={form.disponibilite ?? true}
                  onChange={(e) => setForm((p) => ({ ...p, disponibilite: e.target.checked }))}
                />
              )}
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
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action is irreversible.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

