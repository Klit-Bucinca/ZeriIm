import { Navigate, Route, Routes } from 'react-router-dom';
import PostsListPage from '../pages/posts/PostsListPage';
import PostDetailsPage from '../pages/posts/PostDetailsPage';
import EditPostPage from '../pages/posts/EditPostPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/posts" element={<PostsListPage />} />
    <Route path="/posts/:id" element={<PostDetailsPage />} />
    <Route path="/posts/:id/edit" element={<EditPostPage />} />
    <Route path="/" element={<Navigate to="/posts" replace />} />
    <Route
      path="*"
      element={
        <div className="p-6 text-center text-gray-700 dark:text-gray-300">
          Faqja nuk u gjet.
        </div>
      }
    />
  </Routes>
);

export default AppRoutes;
export { AppRoutes };
