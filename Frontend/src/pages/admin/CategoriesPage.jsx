import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categoryService';

const CategoriesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getCategories();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('Nuk mund të ngarkohen kategoritë.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNameInput('');
    setDescriptionInput('');
  };

  const handleCreate = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      await createCategory({
        name: nameInput.trim(),
        description: descriptionInput.trim() || null,
      });
      resetForm();
      await load();
    } catch {
      setError('Shtimi dështoi.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (id) => {
    const target = items.find((x) => (x.id || x.Id) === id);
    setEditingId(id);
    setNameInput(target?.name || target?.Name || '');
    setDescriptionInput(target?.description || target?.Description || '');
  };

  const handleSave = async () => {
    if (!editingId || !nameInput.trim()) return;
    setSaving(true);
    try {
      await updateCategory(editingId, {
        name: nameInput.trim(),
        description: descriptionInput.trim() || null,
      });
      resetForm();
      await load();
    } catch {
      setError('Përditësimi dështoi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Fshi këtë kategori?')) return;
    setSaving(true);
    try {
      await deleteCategory(id);
      await load();
    } catch {
      setError('Fshirja dështoi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kategoritë</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Menaxho kategoritë: shto, përditëso dhe fshi. Këto përdoren në postime.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder={editingId ? 'Përditëso emrin...' : 'Shto kategori të re...'}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="text"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Përshkrimi (opsional)"
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        {editingId ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              Ruaj
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Anulo
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving || !nameInput.trim()}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
          >
            Shto
          </button>
        )}
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
                  Përshkrimi
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Veprimet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((c) => (
                <tr key={c.id || c.Id} className="text-sm text-gray-800 dark:text-gray-200">
                  <td className="px-4 py-3">{c.name || c.Name}</td>
                  <td className="px-4 py-3">{c.description || c.Description || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(c.id || c.Id)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Redakto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id || c.Id)}
                        disabled={saving}
                        className="rounded-md border border-red-500 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/70 dark:text-red-300 dark:hover:bg-red-900/30 disabled:opacity-60"
                      >
                        Fshi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nuk ka kategori.
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

export default CategoriesPage;
