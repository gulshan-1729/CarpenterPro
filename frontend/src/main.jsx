import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3000,

        success: {
          style: {
            background: "#16a34a",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "600",
          },
        },

        error: {
          style: {
            background: "#dc2626",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "600",
          },
        },

        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "12px",
          fontSize: "15px",
        },
      }}
    />

  </StrictMode>
);