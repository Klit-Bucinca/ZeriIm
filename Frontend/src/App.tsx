import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import NotFound from "./pages/OtherPage/NotFound";
import { ScrollToTop } from "./components/common/ScrollToTop";

import SocialLayout from "./layout/SocialLayout";
import PostsListPage from "./pages/posts/PostsListPage";
import PostDetailsPage from "./pages/posts/PostDetailsPage";
import EditPostPage from "./pages/posts/EditPostPage";
import UserProfiles from "./pages/UserProfiles";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";
import UsersPage from "./pages/admin/UsersPage";
import MunicipalitiesPage from "./pages/admin/MunicipalitiesPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* ================= PUBLIC / SOCIAL ================= */}
          <Route element={<SocialLayout />}>
            <Route path="/" element={<PostsListPage />} />
            <Route path="/posts" element={<PostsListPage />} />
            <Route path="/posts/:id" element={<PostDetailsPage />} />
            <Route path="/posts/:id/edit" element={<EditPostPage />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>

      {/* ================= DASHBOARD / ADMIN ================= */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<UsersPage />} />
              <Route path="/municipalities" element={<MunicipalitiesPage />} />
            </Route>
          </Route>

          {/* ================= AUTH ================= */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
