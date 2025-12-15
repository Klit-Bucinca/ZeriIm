import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/postService';
import PostForm from '../../components/posts/PostForm';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createPost({
        Title: values.title,
        Content: values.content,
        Municipality: values.municipality,
        CategoryId: values.categoryId || null,
        ImageUrls: values.imageUrls?.filter(Boolean) || [],
      });
      navigate('/posts');
    } catch {
      // TODO: handle error states
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Krijo postim
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Ploteso fushat per te shtuar nje postim te ri.
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
        <PostForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
};

export default CreatePostPage;
export { CreatePostPage };
