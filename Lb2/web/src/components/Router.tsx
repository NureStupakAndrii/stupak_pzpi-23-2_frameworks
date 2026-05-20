import type { ReactElement } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { BrowsePage } from "../pages/BrowsePage";
import { ProfilePage } from "../pages/ProfilePage";
import { UploadPage } from "../pages/UploadPage";
import { VideoPage } from "../pages/VideoPage";

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/videos/:videoId" element={<VideoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
