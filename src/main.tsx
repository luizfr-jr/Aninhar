import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const AdminApp = lazy(() => import("./admin/AdminApp"));
const isAdmin =
  window.location.pathname === "/admin" ||
  window.location.pathname.startsWith("/admin/");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense
        fallback={
          <main className="admin-loading" role="status">
            Carregando administração…
          </main>
        }
      >
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
