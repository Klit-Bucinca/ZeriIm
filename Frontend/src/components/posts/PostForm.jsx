import { useEffect, useState } from 'react';

const defaultValues = {
  title: '',
  content: '',
  municipality: '',
  categoryId: '',
  imageUrls: [''],
};

const PostForm = ({ initialValues = {}, onSubmit, submitting = false }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (index, value) => {
    setValues((prev) => {
      const next = [...prev.imageUrls];
      next[index] = value;
      return { ...prev, imageUrls: next };
    });
  };

  const handleAddImage = () => {
    setValues((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const handleRemoveImage = (index) => {
    setValues((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Titulli
        </label>
        <input
          type="text"
          value={values.title}
          onChange={handleChange('title')}
          placeholder="Sheno titullin"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Permbajtja
        </label>
        <textarea
          value={values.content}
          onChange={handleChange('content')}
          placeholder="Shkruaj permbajtjen"
          className="min-h-[140px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Municipaliteti
          </label>
          <input
            type="text"
            value={values.municipality}
            onChange={handleChange('municipality')}
            placeholder="p.sh. Prishtine"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Kategoria
          </label>
          <select
            value={values.categoryId}
            onChange={handleChange('categoryId')}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Zgjidh kategorine</option>
            {/* TODO: populate me te dhenat e kategorive nga API */}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Fotot (URL)
        </div>
        <div className="space-y-2">
          {values.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://shembull.com/foto.jpg"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Fshij
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddImage}
          className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Shto URL fotoje
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Duke ruajtur...' : 'Ruaj postimin'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
export { PostForm };
