import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import AdPlayer from "./pages/AdPlayer";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="adplayer" element={<AdPlayer />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    </BrowserRouter>
);
