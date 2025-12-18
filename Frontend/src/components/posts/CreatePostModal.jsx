import { useEffect, useMemo, useState } from 'react';
import { createPost } from '../../api/postService';
import { getCategories } from '../../api/categoryService';
import { getMunicipalities } from '../../api/municipalityService';

const defaultValues = {
  title: '',
  content: '',
  categoryId: '',
  municipalityId: '',
  files: [],
};

const CreatePostModal = ({ open, onClose, onPostCreated }) => {
  const [values, setValues] = useState(defaultValues);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (open) {
      setLoadingOptions(true);
      Promise.all([getCategories(), getMunicipalities()])
        .then(([catsRes, muniRes]) => {
          const cats = Array.isArray(catsRes.data) ? catsRes.data : [];
          const munis = Array.isArray(muniRes.data) ? muniRes.data : [];
          const fallbackCats =
            cats.length === 0
              ? [{ Id: '00000000-0000-0000-0000-00000000cafe', Name: 'Shembull' }]
              : cats;
          const fallbackMunis =
            munis.length === 0
              ? [{ Id: '00000000-0000-0000-0000-00000000babe', Name: 'Komuna Demo' }]
              : munis;
          setCategories(fallbackCats);
          setMunicipalities(fallbackMunis);
          setValues((prev) => ({
            ...prev,
            categoryId:
              prev.categoryId ||
              fallbackCats[0]?.id ||
              fallbackCats[0]?.Id ||
              '',
            municipalityId:
              prev.municipalityId ||
              fallbackMunis[0]?.id ||
              fallbackMunis[0]?.Id ||
              '',
          }));
        })
        .catch(() => {
          const fallbackCats = [
            { Id: '00000000-0000-0000-0000-00000000cafe', Name: 'Shembull' },
          ];
          const fallbackMunis = [
            { Id: '00000000-0000-0000-0000-00000000babe', Name: 'Komuna Demo' },
          ];
          setCategories(fallbackCats);
          setMunicipalities(fallbackMunis);
          setValues((prev) => ({
            ...prev,
            categoryId:
              prev.categoryId ||
              fallbackCats[0]?.id ||
              fallbackCats[0]?.Id ||
              '',
            municipalityId:
              prev.municipalityId ||
              fallbackMunis[0]?.id ||
              fallbackMunis[0]?.Id ||
              '',
          }));
        })
        .finally(() => setLoadingOptions(false));
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setValues(defaultValues);
      setPreviews([]);
    }
  }, [open]);

  const handleFieldChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setValues((prev) => ({ ...prev, files: [...prev.files, ...files] }));
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveImage = (index) => {
    setValues((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = useMemo(
    () =>
      values.title.trim().length > 0 &&
      values.content.trim().length > 0 &&
      values.categoryId &&
      values.municipalityId,
    [values]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('Title', values.title.trim());
      formData.append('Content', values.content);
      formData.append('CategoryId', values.categoryId);
      formData.append('MunicipalityId', values.municipalityId);
      values.files.forEach((file) => formData.append('Images', file));

      await createPost(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onPostCreated?.();
      onClose?.();
      setValues(defaultValues);
      setPreviews([]);
    } catch (err) {
      const message =
        err?.response?.data ||
        err?.message ||
        'Nuk u krye postimi. Provoni perseri.';
      setSubmitError(
        typeof message === 'string' ? message : 'Nuk u krye postimi.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 pb-10"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Krijo nje postim
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Mbyll
          </button>
        </div>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
                {submitError}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Titulli
              </label>
              <input
                type="text"
                value={values.title}
                onChange={handleFieldChange('title')}
                placeholder="Shkruaj titullin"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <textarea
              value={values.content}
              onChange={handleFieldChange('content')}
              placeholder="Cfare deshiron te ndash?"
              className="min-h-[160px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Komuna
                </label>
                <select
                  value={values.municipalityId}
                  onChange={handleFieldChange('municipalityId')}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    {loadingOptions ? 'Duke u ngarkuar...' : 'Zgjidh komunen'}
                  </option>
                  {Array.isArray(municipalities) &&
                    municipalities.map((m) => (
                      <option key={m.id ?? m.Id} value={m.id ?? m.Id}>
                        {m.name ?? m.Name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Kategoria
                </label>
                <select
                  value={values.categoryId}
                  onChange={handleFieldChange('categoryId')}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    {loadingOptions ? 'Duke u ngarkuar...' : 'Zgjidh kategorine'}
                  </option>
                  {Array.isArray(categories) &&
                    categories.map((c) => (
                      <option key={c.id ?? c.Id} value={c.id ?? c.Id}>
                        {c.name ?? c.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Ngarko foto (mund te zgjedhesh disa)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-105 dark:text-gray-200"
              />
              {previews.length > 0 && (
                <div className="space-y-2">
                  {(() => {
                    const limited = previews.slice(0, 4);
                    const extra = previews.length - limited.length;

                    if (limited.length === 1) {
                      return (
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <img
                            src={limited[0].url}
                            alt={limited[0].name}
                            className="h-auto w-full max-h-[400px] object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(0)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                          >
                            Hiq
                          </button>
                        </div>
                      );
                    }

                    if (limited.length === 2) {
                      return (
                        <div className="grid grid-cols-2 gap-2">
                          {limited.map((preview, idx) => (
                            <div
                              key={preview.url}
                              className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <img
                                src={preview.url}
                                alt={preview.name}
                                className="h-48 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                              >
                                Hiq
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    if (limited.length === 3) {
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                            <img
                              src={limited[0].url}
                              alt={limited[0].name}
                              className="h-64 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(0)}
                              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                            >
                              Hiq
                            </button>
                          </div>
                          <div className="col-span-1 grid grid-rows-2 gap-2">
                            {limited.slice(1).map((preview, idx) => (
                              <div
                                key={preview.url}
                                className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                              >
                                <img
                                  src={preview.url}
                                  alt={preview.name}
                                  className="h-32 w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx + 1)}
                                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                                >
                                  Hiq
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 gap-2">
                        {limited.map((preview, idx) => (
                          <div
                            key={preview.url}
                            className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="h-40 w-full object-cover"
                            />
                            {extra > 0 && idx === limited.length - 1 ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                                +{extra}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                              >
                                Hiq
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-none justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Anulo
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-primary/70 disabled:text-white bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Duke u postuar...' : 'Posto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
export { CreatePostModal };
