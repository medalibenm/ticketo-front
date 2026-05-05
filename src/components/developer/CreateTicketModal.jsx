import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Sélectionnez une catégorie' },
  { value: 'NETWORK', label: 'Réseau' },
  { value: 'DATABASE', label: 'Base de données' },
  { value: 'SERVER_OS', label: 'Serveur / OS' },
  { value: 'DEPLOYMENT', label: 'Déploiement' },
  { value: 'SECURITY', label: 'Sécurité' },
  { value: 'API_GATEWAY', label: 'API Gateway' },
  { value: 'STORAGE', label: 'Stockage' },
  { value: 'OTHER', label: 'Autre' },
];

const EMPTY_FORM = { title: '', category: '', description: '' };

export default function CreateTicketModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Le titre est requis.';
    if (!form.category) e.category = 'La catégorie est requise.';
    if (!form.description.trim()) e.description = 'La description est requise.';
    else if (form.description.trim().length < 20) e.description = 'Description trop courte (20 caractères minimum).';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({ title: form.title.trim(), category: form.category, description: form.description.trim() });
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Créer un nouveau ticket"
      maxWidth="max-w-[560px]"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} loading={loading}>Soumettre le ticket</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Titre"
          value={form.title}
          onChange={set('title')}
          placeholder="Décrivez brièvement le problème"
          error={errors.title}
        />
        <Select
          label="Catégorie"
          value={form.category}
          onChange={set('category')}
          error={errors.category}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
          ))}
        </Select>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-medium text-text-secondary">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            className="w-full bg-input-bg border border-input-border rounded-btn px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
            rows={5}
            value={form.description}
            onChange={set('description')}
            placeholder="Décrivez le problème en détail : contexte, étapes pour reproduire, impact observé..."
          />
          {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
          <p className="text-xs text-text-muted">{form.description.length} caractères</p>
        </div>
      </div>
    </Modal>
  );
}
