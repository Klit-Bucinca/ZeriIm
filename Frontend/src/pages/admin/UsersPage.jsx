import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../../api/userService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getUsers();
      setUsers(data || []);
    } catch {
      setError('Nuk mund të ngarkohen përdoruesit.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (u) => {
    setEditingId(u.id || u.Id);
    setForm({
      username: u.username || u.Username || '',
      email: u.email || u.Email || '',
      role: u.role || u.Role || 'Citizen',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ username: '', email: '', role: '' });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateUser(editingId, {
        Username: form.username,
        Email: form.email,
        Role: form.role,
      });
      await load();
      cancelEdit();
    } catch {
      setError('Përditësimi dështoi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Fshi këtë përdorues?')) return;
    setSaving(true);
    try {
      await deleteUser(id);
      await load();
    } catch {
      setError('Fshirja dështoi.');
    } finally {
      setSaving(false);
    }
  };

  const normalize = (text) => (text || '').toString().toLowerCase();
  const filteredUsers = users
    .filter((u) => {
      if (!search.trim()) return true;
      const term = normalize(search);
      return (
        normalize(u.username || u.Username).includes(term) ||
        normalize(u.email || u.Email).includes(term) ||
        normalize(u.role || u.Role).includes(term)
      );
    })
    .sort((a, b) => (a.username || a.Username || '').localeCompare(b.username || b.Username || ''));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Përdoruesit</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Menaxho përdoruesit: shiko, redakto dhe fshi.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko me emër, email ose rol..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-gray-700 dark:text-gray-200">Duke ngarkuar...</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Emri
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Roli
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Veprimet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((u) => {
                const isEditing = editingId === u.id || editingId === u.Id;
                const id = u.id || u.Id;
                return (
                  <tr key={id} className="text-sm text-gray-800 dark:text-gray-200">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                          value={form.username}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                      ) : (
                        u.username || u.Username || '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      ) : (
                        u.email || u.Email || '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Citizen">Citizen</option>
                        </select>
                      ) : (
                        u.role || u.Role || 'Citizen'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
                          >
                            Ruaj
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            Anulo
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(u)}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            Redakto
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            disabled={saving}
                            className="rounded-md border border-red-500 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/70 dark:text-red-300 dark:hover:bg-red-900/30 disabled:opacity-60"
                          >
                            Fshi
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nuk ka përdorues.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
