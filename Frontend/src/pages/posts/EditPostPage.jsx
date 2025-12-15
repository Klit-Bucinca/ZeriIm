import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../../api/postService';
import PostForm from '../../components/posts/PostForm';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const { data } = await getPostById(id);
        setInitialValues({
          title: data.Title || '',
          content: data.Content || '',
          municipality: data.Municipality || '',
          categoryId: data.CategoryId || '',
          imageUrls: data.ImageUrls && data.ImageUrls.length > 0 ? data.ImageUrls : [''],
        });
      } catch {
        setError('Nuk mund te ngarkojme postimin.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (values) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await updatePost(id, {
        Title: values.title,
        Content: values.content,
        Municipality: values.municipality,
        CategoryId: values.categoryId || null,
        ImageUrls: values.imageUrls?.filter(Boolean) || [],
      });
      navigate(`/posts/${id}`);
    } catch {
      // TODO: handle error states
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-200">
        Duke ngarkuar postimin...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!initialValues) return null;

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Redakto postimin
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Perditeso informacionin e postimit.
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
        <PostForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default EditPostPage;
export { EditPostPage };
