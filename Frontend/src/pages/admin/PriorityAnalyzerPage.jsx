import { useEffect, useState } from 'react';
import { getTopPriority } from '../../api/priorityService';

const now = new Date();
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const resolveImage = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${apiBase}${url}`;
};

const PriorityAnalyzerPage = () => {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getTopPriority({ year, month, limit });
      setData(data?.Items || data?.items || []);
    } catch {
      setError('Nuk mund të ngarkohen prioritetet.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePrintGroup = (groupId) => {
    const section = document.getElementById(groupId);
    if (!section) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Prioritetet</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            .group { margin-bottom: 24px; }
            .posts { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
            .thumb { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; background: #f5f5f5; }
            .title { font-weight: 700; margin: 8px 0 4px; }
            .meta { color: #555; font-size: 12px; }
            .score { font-weight: 600; color: #0a7b45; }
          </style>
        </head>
        <body>${section.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const months = [
    'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
    'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Prioritetet mujore</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Top {limit} postimet me më shumë vota për çdo komunë, për muajin e zgjedhur.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">Muaji</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">Viti</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">Kufiri</label>
          <input
            type="number"
            min={1}
            max={50}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Rifresko
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-gray-700 dark:text-gray-200">Duke ngarkuar...</div>
      ) : (
        <div className="mt-6 space-y-6 print:block">
          {data.map((group) => (
            <div
              key={group.Municipality || group.municipality}
              id={`group-${group.Municipality || group.municipality}`}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {group.Municipality || group.municipality}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Top {limit}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePrintGroup(`group-${group.Municipality || group.municipality}`)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Printo / Shkarko
                  </button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(group.Posts || group.posts || []).map((p, idx) => {
                  const thumb = resolveImage(p.ThumbnailUrl || p.thumbnailUrl);
                  return (
                    <div
                      key={p.Id || p.id}
                      className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          #{idx + 1} {p.Title || p.title}
                        </span>
                        <span className="text-xs font-medium text-primary">
                          {p.Score ?? p.score ?? 0} vota
                        </span>
                      </div>
                      {thumb && (
                        <div className="mt-2">
                          <img
                            src={thumb}
                            alt={p.Title || p.title}
                            className="h-28 w-full rounded-md object-cover"
                          />
                        </div>
                      )}
                      <p className="mt-2 text-gray-700 dark:text-gray-200 line-clamp-4">
                        {p.Content || p.content}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-300">
                        <span>{p.CategoryName || p.categoryName || '—'}</span>
                        <span>
                          {new Date(p.CreatedAt || p.createdAt).toLocaleDateString('sq-AL')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">Nuk ka të dhëna për këtë muaj.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriorityAnalyzerPage;
