import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FilterRoutes from "./components/FilterRoutes";
import App from "./App";
import HomePage from "./pages/HomePage";
import AdPlayer from "./pages/AdPlayer";
import Login from "./pages/Login";

import AdminPage from "./pages/admin/AdminPage";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="adplayer" element={<AdPlayer />} />
            </Route>
            <Route
                path="login"
                element={
                    <FilterRoutes>
                        <Login />
                    </FilterRoutes>
                }
            />
            <Route
                path="admin"
                element={
                    <FilterRoutes users={["admin"]}>
                        <AdminPage />
                    </FilterRoutes>
                }
            />
        </Routes>
    </BrowserRouter>
);
