import { useEffect, useState } from 'react';
import {
  getMunicipalities,
  createMunicipality,
  updateMunicipality,
  deleteMunicipality,
} from '../../api/municipalityService';

const MunicipalitiesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [populationInput, setPopulationInput] = useState('');
  const [contactInput, setContactInput] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getMunicipalities();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('Nuk mund të ngarkohen komunat.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      await createMunicipality({
        Name: nameInput.trim(),
        Region: regionInput.trim(),
        Population: populationInput ? Number(populationInput) : null,
        Contact: contactInput.trim() || null,
      });
      setNameInput('');
      setRegionInput('');
      setPopulationInput('');
      setContactInput('');
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
    setRegionInput(target?.region || target?.Region || '');
    setPopulationInput(
      target?.population != null
        ? String(target.population)
        : target?.Population != null
        ? String(target.Population)
        : ''
    );
    setContactInput(target?.contact || target?.Contact || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNameInput('');
    setRegionInput('');
    setPopulationInput('');
    setContactInput('');
  };

  const handleSave = async () => {
    if (!editingId || !nameInput.trim()) return;
    setSaving(true);
    try {
      await updateMunicipality(editingId, {
        Name: nameInput.trim(),
        Region: regionInput.trim(),
        Population: populationInput ? Number(populationInput) : null,
        Contact: contactInput.trim() || null,
      });
      cancelEdit();
      await load();
    } catch {
      setError('Përditësimi dështoi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Fshi këtë komunë?')) return;
    setSaving(true);
    try {
      await deleteMunicipality(id);
      await load();
    } catch {
      setError('Fshirja dështoi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Komunat</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Menaxho komunat: shto, përditëso dhe fshi. Shto metadatat si rajoni, popullsia dhe kontakti.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder={editingId ? 'Përditëso emrin...' : 'Shto komunë të re...'}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="text"
          value={regionInput}
          onChange={(e) => setRegionInput(e.target.value)}
          placeholder="Rajoni"
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="number"
          value={populationInput}
          onChange={(e) => setPopulationInput(e.target.value)}
          placeholder="Popullsia"
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="text"
          value={contactInput}
          onChange={(e) => setContactInput(e.target.value)}
          placeholder="Kontakti (email/telefon)"
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
              onClick={cancelEdit}
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
                  Rajoni
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Popullsia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Kontakti
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Veprimet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((m) => (
                <tr key={m.id || m.Id} className="text-sm text-gray-800 dark:text-gray-200">
                  <td className="px-4 py-3">{m.name || m.Name}</td>
                  <td className="px-4 py-3">{m.region || m.Region || '—'}</td>
                  <td className="px-4 py-3">{m.population ?? m.Population ?? '—'}</td>
                  <td className="px-4 py-3">{m.contact || m.Contact || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(m.id || m.Id)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Redakto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id || m.Id)}
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
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nuk ka komuna.
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

export default MunicipalitiesPage;
