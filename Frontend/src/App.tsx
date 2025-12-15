import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";

import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";

import AppLayout from "./layout/AppLayout";
import SocialLayout from "./layout/SocialLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import PostsListPage from "./pages/posts/PostsListPage";
import PostDetailsPage from "./pages/posts/PostDetailsPage";
import EditPostPage from "./pages/posts/EditPostPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Social pages */}
        <Route element={<SocialLayout />}>
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/profile" element={<UserProfiles />} />
        </Route>

        {/* Dashboard pages */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
        </Route>

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
