import React, { useRef, useState } from 'react';
import { Camera, KeyRound, Trash2, UserRound } from 'lucide-react';
import { UserProfile } from '../../types';
import { api } from '../../services/api';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onDeleteAccount: () => void;
  onShowToast: (message: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onDeleteAccount,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    terminalUnit: user.terminalUnit,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        ...form,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      onUpdateUser(updated);
      setCurrentPassword('');
      setNewPassword('');
      onShowToast('Profil enregistré avec succès.');
    } catch (error) {
      onShowToast(error instanceof Error ? error.message : 'Échec de la mise à jour du profil.');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const avatarUrl = await api.uploadAvatar(file);
      onUpdateUser({ ...user, avatarUrl });
      onShowToast('Photo de profil mise à jour.');
    } catch (error) {
      onShowToast(error instanceof Error ? error.message : 'Échec du téléchargement de la photo.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const deleteAccount = async () => {
    try {
      await api.deleteAccount(deletePassword);
      onDeleteAccount();
    } catch (error) {
      onShowToast(error instanceof Error ? error.message : 'Échec de la suppression du compte.');
    }
  };

  const inputClass = 'mt-1 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 py-2.5 text-sm text-[#1c1c18] outline-none focus:border-[#316b00] focus:ring-2 focus:ring-[#316b00]/10';

  return (
    <div className="h-full overflow-y-auto bg-[#f8f6f1]">
      <div className="mx-auto max-w-4xl p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1c1c18]">Mon profil</h1>
          <p className="mt-1 text-sm text-[#717a68]">Gérez vos informations personnelles et la sécurité de votre compte.</p>
        </div>

        <form onSubmit={saveProfile} className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <section className="h-fit rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img src={user.avatarUrl} alt={user.name} className="h-28 w-28 rounded-full object-cover ring-4 ring-[#e6eee0]" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#316b00] text-white shadow"
                  title="Changer la photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
              </div>
              <p className="mt-3 font-bold text-[#1c1c18]">{user.name}</p>
              <p className="text-xs text-[#717a68]">{user.role}</p>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-[#eeeae2] pb-3">
                <UserRound className="h-4 w-4 text-[#316b00]" />
                <h2 className="text-sm font-bold">Informations personnelles</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-[#52634a]">Nom complet
                  <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </label>
                <label className="text-xs font-semibold text-[#52634a]">Adresse email
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </label>
                <label className="text-xs font-semibold text-[#52634a]">Fonction
                  <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </label>
                <label className="text-xs font-semibold text-[#52634a]">Secteur / unité
                  <input className={inputClass} value={form.terminalUnit} onChange={(e) => setForm({ ...form, terminalUnit: e.target.value })} />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-[#eeeae2] pb-3">
                <KeyRound className="h-4 w-4 text-[#316b00]" />
                <h2 className="text-sm font-bold">Changer le mot de passe</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-[#52634a]">Mot de passe actuel
                  <input type="password" autoComplete="current-password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </label>
                <label className="text-xs font-semibold text-[#52634a]">Nouveau mot de passe
                  <input type="password" autoComplete="new-password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 caractères" />
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="rounded-xl bg-[#316b00] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#275800] disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>

            <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-red-800">Supprimer le compte</h2>
                  <p className="mt-1 text-xs text-red-700">Cette action est définitive : votre profil, vos parcelles et vos données associées seront supprimés.</p>
                  {!showDeleteConfirm ? (
                    <button type="button" onClick={() => setShowDeleteConfirm(true)} className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100">
                      Supprimer mon compte
                    </button>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input type="password" autoComplete="current-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Mot de passe" className="rounded-lg border border-red-300 px-3 py-2 text-sm outline-none" />
                      <button type="button" onClick={deleteAccount} className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800">Confirmer définitivement</button>
                      <button type="button" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#717a68]">Annuler</button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};
